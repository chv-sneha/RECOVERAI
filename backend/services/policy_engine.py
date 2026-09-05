from ..schemas import PolicyValidationResult, AIDiagnosisOutput
from ..models import PolicyConfigModel, RecoveryCaseModel
import datetime

def validate_action_against_policy(
    proposed_action: str,
    diagnosis: AIDiagnosisOutput,
    case: RecoveryCaseModel,
    policy_config: PolicyConfigModel
) -> PolicyValidationResult:
    """
    Deterministic Policy & Guardrail Engine.
    Overrides AI suggestions if any business policy or compliance guardrail is breached.
    """
    # Guardrail 1: Hard Non-Recoverable Stop
    if not diagnosis.is_recoverable or proposed_action == "STOP_RECOVERY":
        return PolicyValidationResult(
            is_approved=True,
            status_code="APPROVED",
            gating_reason="Permanent stop or non-recoverable case. Escalation/Halt policy applied.",
            final_action="STOP_RECOVERY"
        )

    # Guardrail 2: Max Attempts Limit
    if case.attempts_count >= policy_config.max_retries:
        return PolicyValidationResult(
            is_approved=False,
            status_code="REJECTED_MAX_RETRIES",
            gating_reason=f"Attempt limit reached ({case.attempts_count}/{policy_config.max_retries}). Routing to Human Escalation Queue.",
            final_action="ESCALATE_TO_HUMAN"
        )

    # Guardrail 3: Autonomous Monetary Cap Threshold
    if case.amount_at_risk > policy_config.max_autonomous_cap:
        return PolicyValidationResult(
            is_approved=False,
            status_code="ESCALATED_HUMAN",
            gating_reason=f"Amount (₹{case.amount_at_risk:,.2f}) exceeds autonomous recovery policy cap (₹{policy_config.max_autonomous_cap:,.2f}). Human approval required.",
            final_action="ESCALATE_TO_HUMAN"
        )

    # Guardrail 4: Active Promise-to-Pay Lockout
    if case.promise_to_pay_date and case.promise_to_pay_date > datetime.datetime.utcnow():
        return PolicyValidationResult(
            is_approved=False,
            status_code="REJECTED_COOLDOWN",
            gating_reason=f"Active Promise-to-Pay recorded until {case.promise_to_pay_date.strftime('%Y-%m-%d')}. Autonomous actions paused.",
            final_action="STOP_RECOVERY"
        )

    # Guardrail 5: Cooldown Enforcement
    if case.next_action_due and case.next_action_due > datetime.datetime.utcnow():
        wait_minutes = int((case.next_action_due - datetime.datetime.utcnow()).total_seconds() / 60)
        return PolicyValidationResult(
            is_approved=False,
            status_code="REJECTED_COOLDOWN",
            gating_reason=f"Cooldown window active ({wait_minutes} mins remaining). Action postponed to respect customer communication policy.",
            final_action="SCHEDULE_LATER"
        )

    # Policy Check Passed
    return PolicyValidationResult(
        is_approved=True,
        status_code="GATED_PASSED" if case.amount_at_risk > policy_config.require_approval_above else "APPROVED",
        gating_reason="Action satisfies all retry frequency, monetary cap, and cooldown guardrails.",
        final_action=proposed_action
    )
