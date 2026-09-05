import asyncio
import random
import uuid
from sqlalchemy.orm import Session
from ..schemas import WebhookEventPayload, BatchSimulationConfig, BatchSimulationReport
from .orchestrator import RecoveryOrchestrator

SCENARIOS = [
    {
        "event_type": "payment.failed",
        "failure_reason": "INSUFFICIENT_FUNDS",
        "failure_code": "BAD_REQUEST_ERROR",
        "amount_range": (1500, 15000),
        "risk_type": "PAYMENT_FAILURE"
    },
    {
        "event_type": "payment.failed",
        "failure_reason": "AUTHENTICATION_FAILED",
        "failure_code": "GATEWAY_TIMEOUT",
        "amount_range": (2999, 25000),
        "risk_type": "PAYMENT_FAILURE"
    },
    {
        "event_type": "checkout.abandoned",
        "failure_reason": "SESSION_ABANDONED",
        "failure_code": "CHECKOUT_DROPOFF",
        "amount_range": (4999, 45000),
        "risk_type": "CHECKOUT_ABANDONMENT"
    },
    {
        "event_type": "invoice.overdue",
        "failure_reason": "TERMS_ELAPSED",
        "failure_code": "RECEIVABLE_OVERDUE",
        "amount_range": (25000, 150000),
        "risk_type": "B2B_RECEIVABLE"
    },
    {
        "event_type": "subscription.payment_failed",
        "failure_reason": "CARD_EXPIRED",
        "failure_code": "RECURRING_AUTH_FAILED",
        "amount_range": (999, 9999),
        "risk_type": "SUBSCRIPTION_FAILURE"
    }
]

async def run_batch_simulation(db: Session, config: BatchSimulationConfig, broadcast_func=None) -> BatchSimulationReport:
    orchestrator = RecoveryOrchestrator(db, websocket_broadcast_func=broadcast_func)
    
    total_events = config.event_count
    customer_ids = [f"cust_sim_{i+100}" for i in range(config.customer_count)]
    
    cases_processed = []
    
    for i in range(total_events):
        scen = random.choice(SCENARIOS)
        cust_id = random.choice(customer_ids)
        amount = float(random.randint(scen["amount_range"][0], scen["amount_range"][1]))
        
        payload = WebhookEventPayload(
            event_type=scen["event_type"],
            source="SIMULATOR",
            customer_id=cust_id,
            customer_name=f"Merchant Client {cust_id[-3:]}",
            customer_email=f"client_{cust_id[-3:]}@enterprise.com",
            order_id=f"order_sim_{uuid.uuid4().hex[:8]}",
            payment_id=f"pay_sim_{uuid.uuid4().hex[:8]}",
            amount=amount,
            currency="INR",
            failure_reason=scen["failure_reason"],
            failure_code=scen["failure_code"]
        )
        
        case = await orchestrator.process_incoming_event(payload)
        if case:
            cases_processed.append(case)
            
        # Slight async delay for realistic simulation feel if streaming
        if broadcast_func:
            await asyncio.sleep(0.15)
            
    # Calculate exact aggregate metrics from actual simulated cases
    total_at_risk = sum(c.amount_at_risk for c in cases_processed)
    est_recoverable = sum(c.estimated_recoverable for c in cases_processed)
    recovered_cases = [c for c in cases_processed if c.state == "RECOVERED"]
    total_recovered = sum(c.amount_at_risk for c in recovered_cases)
    
    escalated_cases = len([c for c in cases_processed if c.state == "ESCALATED"])
    stopped_cases = len([c for c in cases_processed if c.state == "STOPPED"])
    successful_interventions = len(recovered_cases)
    failed_interventions = len(cases_processed) - successful_interventions - escalated_cases
    
    recovery_rate = (total_recovered / total_at_risk * 100.0) if total_at_risk > 0 else 0.0
    
    # Recovery by type breakdown
    type_breakdown = {}
    for c in cases_processed:
        if c.state == "RECOVERED":
            type_breakdown[c.revenue_risk_type] = type_breakdown.get(c.revenue_risk_type, 0.0) + c.amount_at_risk
            
    report = BatchSimulationReport(
        total_events_processed=len(cases_processed),
        total_revenue_at_risk=round(total_at_risk, 2),
        estimated_recoverable_revenue=round(est_recoverable, 2),
        total_revenue_recovered=round(total_recovered, 2),
        recovery_rate_percent=round(recovery_rate, 1),
        successful_interventions=successful_interventions,
        failed_interventions=failed_interventions,
        escalated_cases=escalated_cases,
        stopped_cases=stopped_cases,
        roi_multiple=round(total_recovered / (total_at_risk * 0.05 + 1), 1),
        recovery_by_type=type_breakdown
    )
    
    return report
