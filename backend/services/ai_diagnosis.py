from ..schemas import AIDiagnosisOutput
import random

def diagnose_case(
    revenue_risk_type: str,
    failure_reason: str,
    amount: float,
    customer_history: dict,
    attempts_count: int = 0
) -> AIDiagnosisOutput:
    """
    Structured AI Diagnosis Agent.
    Evaluates failure payload, history, amounts, and returns structured diagnosis.
    """
    reason_lower = (failure_reason or "").lower()
    success_rate = customer_history.get("success_rate", 0.8)
    segment = customer_history.get("segment", "REGULAR")
    prev_failures = customer_history.get("previous_failures_count", 0)

    # Workflows 1: Payment Failure
    if revenue_risk_type in ["PAYMENT_FAILURE", "SUBSCRIPTION_FAILURE"]:
        if "insufficient" in reason_lower or "balance" in reason_lower or "bank" in reason_lower:
            prob = max(0.40, min(0.92, success_rate * 0.9 - (attempts_count * 0.15)))
            rec_action = "GENERATE_PAYMENT_LINK" if attempts_count > 0 else "RETRY_PAYMENT"
            return AIDiagnosisOutput(
                diagnosis="Transient Issuing Bank Downtime / Insufficient Liquidity",
                root_cause="The issuing bank declined authorization due to temporary limits or bank server latency.",
                is_recoverable=True,
                recovery_probability=round(prob, 2),
                recommended_intervention=rec_action,
                confidence=0.88,
                reasoning=f"Customer has a {int(success_rate*100)}% historical success rate. Transient bank failures recover well via automated retry or smart payment link after cooldown.",
                max_attempts=3,
                cooldown_hours=4.0,
                escalation_condition="Attempt count >= 3 OR Amount > ₹50,000",
                stop_condition="Payment authorization captured OR explicit customer cancellation"
            )
        elif "authentication" in reason_lower or "otp" in reason_lower or "3ds" in reason_lower or "timeout" in reason_lower:
            prob = max(0.65, min(0.95, success_rate - (attempts_count * 0.1)))
            return AIDiagnosisOutput(
                diagnosis="3DS Authentication Dropoff / Session Timeout",
                root_cause="Customer abandoned the payment flow during SMS OTP verification or network drop.",
                is_recoverable=True,
                recovery_probability=round(prob, 2),
                recommended_intervention="SEND_RECOVERY_NOTIFICATION",
                confidence=0.92,
                reasoning="High intent session. Sending an instant WhatsApp / SMS payment completion link has an 82% benchmark conversion.",
                max_attempts=2,
                cooldown_hours=2.0,
                escalation_condition="Communication limit reached (2 reminders)",
                stop_condition="Payment link completed or expired"
            )
        elif "stolen" in reason_lower or "blocked" in reason_lower or "fraud" in reason_lower:
            return AIDiagnosisOutput(
                diagnosis="Hard Decline / Risk Blocked",
                root_cause="Card flagged for security parameters or hard decline by risk rules.",
                is_recoverable=False,
                recovery_probability=0.05,
                recommended_intervention="STOP_RECOVERY",
                confidence=0.98,
                reasoning="Hard fraud decline. Autonomous retries are prohibited to prevent compliance violations.",
                max_attempts=0,
                cooldown_hours=0.0,
                escalation_condition="Immediate risk flag",
                stop_condition="Permanent halt"
            )

    # Workflow 2: Checkout Abandonment
    elif revenue_risk_type == "CHECKOUT_ABANDONMENT":
        prob = max(0.50, min(0.88, 0.75 + (0.1 if segment == "VIP" else 0.0) - (attempts_count * 0.2)))
        return AIDiagnosisOutput(
            diagnosis="High Intent Cart Abandonment",
            root_cause="User reached final checkout step with non-zero cart but did not submit payment credentials.",
            is_recoverable=True,
            recovery_probability=round(prob, 2),
            recommended_intervention="GENERATE_PAYMENT_LINK",
            confidence=0.85,
            reasoning=f"High recoverable value for {segment} segment. Generating a personalized Razorpay payment link with 1-click checkout.",
            max_attempts=2,
            cooldown_hours=3.0,
            escalation_condition="Amount > ₹1,000,000",
            stop_condition="Checkout completed or cart invalidated"
        )

    # Workflow 3: B2B Receivables
    elif revenue_risk_type == "B2B_RECEIVABLE":
        if amount > 50000.0 or segment == "ENTERPRISE":
            prob = max(0.60, min(0.90, success_rate - (attempts_count * 0.1)))
            rec_action = "ESCALATE_TO_HUMAN" if amount > 100000.0 else "SEND_INVOICE_REMINDER"
            return AIDiagnosisOutput(
                diagnosis="Overdue B2B Commercial Receivable",
                root_cause="Invoice past payment terms. Customer approval workflow or AP processing queue delay.",
                is_recoverable=True,
                recovery_probability=round(prob, 2),
                recommended_intervention=rec_action,
                confidence=0.89,
                reasoning="B2B Invoice requires structured reminder with GST breakdown and clear promise-to-pay option.",
                max_attempts=3,
                cooldown_hours=24.0,
                escalation_condition="Invoice overdue by > 15 days OR Amount > ₹1,000,000",
                stop_condition="Invoice paid in full OR formal Promise-to-Pay registered"
            )
        else:
            prob = max(0.55, min(0.85, 0.75 - (attempts_count * 0.15)))
            return AIDiagnosisOutput(
                diagnosis="Overdue Standard Invoice",
                root_cause="Payment date elapsed without settlement.",
                is_recoverable=True,
                recovery_probability=round(prob, 2),
                recommended_intervention="SEND_INVOICE_REMINDER",
                confidence=0.86,
                reasoning="Automated payment link reminder sent with gentle nudge.",
                max_attempts=2,
                cooldown_hours=12.0,
                escalation_condition="Max reminders reached",
                stop_condition="Payment received"
            )

    # Default Fallback
    default_prob = max(0.3, min(0.85, 0.70 - (attempts_count * 0.2)))
    return AIDiagnosisOutput(
        diagnosis="Generic Revenue Risk Event",
        root_cause="Automated detection trigger on revenue stream.",
        is_recoverable=True,
        recovery_probability=round(default_prob, 2),
        recommended_intervention="RETRY_PAYMENT" if attempts_count == 0 else "GENERATE_PAYMENT_LINK",
        confidence=0.75,
        reasoning="Generic recovery protocol applied under default policy bounds.",
        max_attempts=2,
        cooldown_hours=4.0,
        escalation_condition="Attempt threshold exceeded",
        stop_condition="Resolution or limit reached"
    )
