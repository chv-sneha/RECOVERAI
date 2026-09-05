def compute_revenue_risk(amount: float, recovery_probability: float):
    """
    Calculates expected recoverable revenue and risk parameters.
    Expected Recoverable = Amount * Recovery Probability
    """
    prob = max(0.0, min(1.0, recovery_probability))
    estimated_recoverable = round(amount * prob, 2)
    
    # Assign Urgency
    if amount >= 50000.0 or prob >= 0.8:
        urgency = "HIGH"
    elif amount >= 15000.0:
        urgency = "MEDIUM"
    else:
        urgency = "LOW"
        
    risk_score = round(1.0 - prob, 2)
    
    return {
        "amount_at_risk": amount,
        "estimated_recoverable": estimated_recoverable,
        "recoverability_score": round(prob, 2),
        "risk_score": risk_score,
        "urgency": urgency
    }
