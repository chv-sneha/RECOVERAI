import datetime
import uuid
import random
from sqlalchemy.orm import Session

from ..models import (
    EventModel, RecoveryCaseModel, ActionModel, 
    AuditLogModel, PolicyConfigModel, CustomerHistoryModel
)
from ..schemas import WebhookEventPayload
from .ai_diagnosis import diagnose_case
from .policy_engine import validate_action_against_policy
from .risk_engine import compute_revenue_risk
from .razorpay_adapter import execute_razorpay_action

class RecoveryOrchestrator:
    """
    State machine and lifecycle coordinator for autonomous revenue recovery cases.
    """
    def __init__(self, db: Session, websocket_broadcast_func=None):
        self.db = db
        self.broadcast = websocket_broadcast_func

    async def _emit_event(self, event_type: str, data: dict):
        if self.broadcast:
            await self.broadcast({
                "type": event_type,
                "timestamp": datetime.datetime.utcnow().isoformat(),
                "data": data
            })

    def get_or_create_policy(self) -> PolicyConfigModel:
        policy = self.db.query(PolicyConfigModel).filter(PolicyConfigModel.is_active == True).first()
        if not policy:
            policy = PolicyConfigModel(
                max_retries=3,
                max_reminders=2,
                cooldown_hours=4.0,
                max_autonomous_cap=50000.0,
                escalation_threshold=50000.0
            )
            self.db.add(policy)
            self.db.commit()
            self.db.refresh(policy)
        return policy

    def get_customer_history(self, customer_id: str) -> dict:
        cust = self.db.query(CustomerHistoryModel).filter(CustomerHistoryModel.customer_id == customer_id).first()
        if not cust:
            # Seed synthetic history for realistic signals
            segments = ["REGULAR", "VIP", "ENTERPRISE", "HIGH_RISK"]
            weights = [0.5, 0.2, 0.15, 0.15]
            chosen_seg = random.choices(segments, weights=weights)[0]
            cust = CustomerHistoryModel(
                customer_id=customer_id,
                name=f"Merchant Customer {customer_id[-4:]}",
                email=f"cust_{customer_id[-4:]}@example.com",
                segment=chosen_seg,
                success_rate=0.88 if chosen_seg == "VIP" else (0.60 if chosen_seg == "HIGH_RISK" else 0.78),
                avg_payment_delay_days=1.2,
                previous_failures_count=random.randint(0, 3),
                recovered_failures_count=random.randint(0, 2),
                total_order_value=random.uniform(5000, 150000)
            )
            self.db.add(cust)
            self.db.commit()
            self.db.refresh(cust)

        return {
            "customer_id": cust.customer_id,
            "name": cust.name,
            "email": cust.email,
            "segment": cust.segment,
            "success_rate": cust.success_rate,
            "avg_payment_delay_days": cust.avg_payment_delay_days,
            "previous_failures_count": cust.previous_failures_count,
            "recovered_failures_count": cust.recovered_failures_count,
            "total_order_value": cust.total_order_value
        }

    async def process_incoming_event(self, payload: WebhookEventPayload) -> RecoveryCaseModel:
        # Idempotency check: check if event with identical payment_id or order_id processed recently
        existing_evt = None
        if payload.payment_id:
            existing_evt = self.db.query(EventModel).filter(EventModel.payment_id == payload.payment_id).first()
        
        if existing_evt and payload.event_type.endswith(".failed"):
            # Return associated existing case safely without duplicate recovery action
            existing_case = self.db.query(RecoveryCaseModel).filter(RecoveryCaseModel.transaction_id == payload.payment_id).first()
            if existing_case:
                return existing_case

        # Save Raw Event
        db_event = EventModel(
            event_type=payload.event_type,
            source=payload.source,
            customer_id=payload.customer_id,
            order_id=payload.order_id,
            payment_id=payload.payment_id,
            amount=payload.amount,
            currency=payload.currency,
            raw_payload=payload.raw_payload or payload.dict()
        )
        self.db.add(db_event)
        self.db.commit()
        self.db.refresh(db_event)

        # Notify UI of event arrival
        await self._emit_event("EVENT_INGESTED", {
            "event_id": db_event.event_id,
            "event_type": db_event.event_type,
            "amount": db_event.amount,
            "customer_id": db_event.customer_id
        })

        # Determine Revenue Risk Type
        risk_type = "PAYMENT_FAILURE"
        if "checkout.abandoned" in payload.event_type:
            risk_type = "CHECKOUT_ABANDONMENT"
        elif "invoice.overdue" in payload.event_type:
            risk_type = "B2B_RECEIVABLE"
        elif "subscription" in payload.event_type:
            risk_type = "SUBSCRIPTION_FAILURE"

        # Customer History Signal
        cust_history = self.get_customer_history(payload.customer_id)

        # Initial AI Diagnosis
        diagnosis = diagnose_case(
            revenue_risk_type=risk_type,
            failure_reason=payload.failure_reason or "Authorization Failure",
            amount=payload.amount,
            customer_history=cust_history,
            attempts_count=0
        )

        # Compute Expected Risk Values ($E[R] = Amount * Probability$)
        risk_calc = compute_revenue_risk(payload.amount, diagnosis.recovery_probability)

        # Create Persistent Recovery Case
        tx_id = payload.payment_id or payload.order_id or f"tx_{uuid.uuid4().hex[:10]}"
        case = RecoveryCaseModel(
            customer_id=payload.customer_id,
            customer_name=cust_history["name"],
            customer_email=cust_history["email"],
            transaction_id=tx_id,
            amount_at_risk=payload.amount,
            estimated_recoverable=risk_calc["estimated_recoverable"],
            revenue_risk_type=risk_type,
            failure_reason=payload.failure_reason or diagnosis.diagnosis,
            failure_code=payload.failure_code,
            risk_score=risk_calc["risk_score"],
            recoverability_score=risk_calc["recoverability_score"],
            urgency=risk_calc["urgency"],
            attempts_count=0,
            state="DETECTED"
        )
        self.db.add(case)
        self.db.commit()
        self.db.refresh(case)

        # Audit Log Entry
        log_entry = AuditLogModel(
            case_id=case.case_id,
            event_id=db_event.event_id,
            agent_reasoning=f"Detected revenue leakage event ({risk_type}). Root cause: {diagnosis.root_cause}",
            policy_decision="PENDING",
            state_from="NEW",
            state_to="DETECTED"
        )
        self.db.add(log_entry)
        self.db.commit()

        await self._emit_event("CASE_CREATED", {
            "case_id": case.case_id,
            "customer_name": case.customer_name,
            "amount_at_risk": case.amount_at_risk,
            "estimated_recoverable": case.estimated_recoverable,
            "revenue_risk_type": case.revenue_risk_type,
            "state": case.state,
            "diagnosis": diagnosis.dict()
        })

        # Run Autonomous Recovery Cycle
        return await self.execute_recovery_cycle(case.case_id, diagnosis)

    async def execute_recovery_cycle(self, case_id: str, diagnosis=None) -> RecoveryCaseModel:
        case = self.db.query(RecoveryCaseModel).filter(RecoveryCaseModel.case_id == case_id).first()
        if not case:
            return None

        policy = self.get_or_create_policy()
        cust_history = self.get_customer_history(case.customer_id)

        if not diagnosis:
            diagnosis = diagnose_case(
                revenue_risk_type=case.revenue_risk_type,
                failure_reason=case.failure_reason,
                amount=case.amount_at_risk,
                customer_history=cust_history,
                attempts_count=case.attempts_count
            )

        # Phase 1: AI Diagnosis -> Decision
        case.state = "DECISION_PENDING"
        case.current_action = diagnosis.recommended_intervention
        self.db.commit()

        await self._emit_event("AGENT_DIAGNOSED", {
            "case_id": case.case_id,
            "diagnosis": diagnosis.diagnosis,
            "recommended_action": diagnosis.recommended_intervention,
            "recovery_probability": diagnosis.recovery_probability,
            "reasoning": diagnosis.reasoning
        })

        # Phase 2: Policy & Guardrail Engine Validation
        policy_result = validate_action_against_policy(
            proposed_action=diagnosis.recommended_intervention,
            diagnosis=diagnosis,
            case=case,
            policy_config=policy
        )

        case.state = "POLICY_CHECK"
        self.db.commit()

        await self._emit_event("POLICY_VALIDATED", {
            "case_id": case.case_id,
            "is_approved": policy_result.is_approved,
            "status_code": policy_result.status_code,
            "gating_reason": policy_result.gating_reason,
            "final_action": policy_result.final_action
        })

        # Check if Escalated or Gated Stop
        if policy_result.final_action == "ESCALATE_TO_HUMAN":
            case.state = "ESCALATED"
            case.is_escalated = True
            case.escalation_reason = policy_result.gating_reason
            self.db.commit()

            audit = AuditLogModel(
                case_id=case.case_id,
                agent_reasoning=diagnosis.reasoning,
                policy_decision=policy_result.status_code,
                action_executed="ESCALATE_TO_HUMAN",
                result_summary=policy_result.gating_reason,
                state_from="POLICY_CHECK",
                state_to="ESCALATED"
            )
            self.db.add(audit)
            self.db.commit()

            await self._emit_event("CASE_ESCALATED", {
                "case_id": case.case_id,
                "amount": case.amount_at_risk,
                "reason": policy_result.gating_reason
            })
            return case

        if policy_result.final_action == "STOP_RECOVERY":
            case.state = "STOPPED"
            self.db.commit()

            audit = AuditLogModel(
                case_id=case.case_id,
                agent_reasoning=diagnosis.reasoning,
                policy_decision=policy_result.status_code,
                action_executed="STOP_RECOVERY",
                result_summary="Stopped according to safety rule.",
                state_from="POLICY_CHECK",
                state_to="STOPPED"
            )
            self.db.add(audit)
            self.db.commit()

            await self._emit_event("CASE_STOPPED", {"case_id": case.case_id})
            return case

        # Phase 3: Action Execution
        case.state = "ACTION_EXECUTING"
        case.attempts_count += 1
        case.next_action_due = datetime.datetime.utcnow() + datetime.timedelta(hours=diagnosis.cooldown_hours)
        self.db.commit()

        exec_res = execute_razorpay_action(
            action_type=policy_result.final_action,
            case_data={
                "amount_at_risk": case.amount_at_risk,
                "customer_name": case.customer_name,
                "customer_email": case.customer_email
            }
        )

        db_action = ActionModel(
            case_id=case.case_id,
            action_type=policy_result.final_action,
            parameters={"cooldown_hours": diagnosis.cooldown_hours},
            agent_decision=diagnosis.dict(),
            policy_validation_result=policy_result.dict(),
            execution_result=exec_res,
            external_api_ref=exec_res.get("external_api_ref")
        )
        self.db.add(db_action)
        self.db.commit()

        await self._emit_event("ACTION_EXECUTED", {
            "case_id": case.case_id,
            "action_type": policy_result.final_action,
            "external_ref": exec_res.get("external_api_ref"),
            "attempt": case.attempts_count
        })

        # Phase 4: Observe Result (Simulation vs Sandbox Callback)
        # We compute success based on AI probability & realistic simulator outcome
        is_success = random.random() < diagnosis.recovery_probability

        if is_success:
            case.state = "RECOVERED"
            case.updated_at = datetime.datetime.utcnow()
            self.db.commit()

            audit = AuditLogModel(
                case_id=case.case_id,
                agent_reasoning=diagnosis.reasoning,
                policy_decision=policy_result.status_code,
                action_executed=policy_result.final_action,
                result_summary=f"SUCCESS: ₹{case.amount_at_risk:,.2f} fully recovered into merchant Razorpay account.",
                state_from="ACTION_EXECUTING",
                state_to="RECOVERED"
            )
            self.db.add(audit)
            self.db.commit()

            await self._emit_event("REVENUE_RECOVERED", {
                "case_id": case.case_id,
                "amount_recovered": case.amount_at_risk,
                "action_type": policy_result.final_action,
                "customer_name": case.customer_name
            })
        else:
            if case.attempts_count < policy.max_retries:
                case.state = "RETRY_REQUIRED"
                self.db.commit()

                audit = AuditLogModel(
                    case_id=case.case_id,
                    agent_reasoning=diagnosis.reasoning,
                    policy_decision=policy_result.status_code,
                    action_executed=policy_result.final_action,
                    result_summary=f"Intervention attempt #{case.attempts_count} pending response. Cooldown active.",
                    state_from="ACTION_EXECUTING",
                    state_to="RETRY_REQUIRED"
                )
                self.db.add(audit)
                self.db.commit()

                await self._emit_event("RETRY_SCHEDULED", {
                    "case_id": case.case_id,
                    "attempt": case.attempts_count,
                    "cooldown_hours": diagnosis.cooldown_hours
                })
            else:
                case.state = "ESCALATED"
                case.is_escalated = True
                case.escalation_reason = f"Max retries limit reached ({case.attempts_count} attempts)."
                self.db.commit()

                audit = AuditLogModel(
                    case_id=case.case_id,
                    agent_reasoning=diagnosis.reasoning,
                    policy_decision="REJECTED_MAX_RETRIES",
                    action_executed="ESCALATE_TO_HUMAN",
                    result_summary="Max retries reached without recovery. Routed to merchant finance queue.",
                    state_from="ACTION_EXECUTING",
                    state_to="ESCALATED"
                )
                self.db.add(audit)
                self.db.commit()

                await self._emit_event("CASE_ESCALATED", {
                    "case_id": case.case_id,
                    "amount": case.amount_at_risk,
                    "reason": case.escalation_reason
                })

        return case
