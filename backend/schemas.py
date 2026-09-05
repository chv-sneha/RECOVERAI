from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class MerchantLoginRequest(BaseModel):
    email: str = "rajesh@techcorp.in"
    name: Optional[str] = "Rajesh Kumar"
    company_name: Optional[str] = "TechCorp India Pvt Ltd"

class MerchantProfileResponse(BaseModel):
    merchant_id: str
    name: str
    company_name: str
    email: str
    has_custom_keys: bool
    last_login_at: str

class MerchantKeysUpdate(BaseModel):
    razorpay_key_id: str
    razorpay_key_secret: str

class WebhookEventPayload(BaseModel):
    event_type: str
    source: str = "RAZORPAY_WEBHOOK"
    customer_id: str
    customer_name: Optional[str] = "Merchant Customer"
    customer_email: Optional[str] = "customer@example.com"
    order_id: Optional[str] = None
    payment_id: Optional[str] = None
    amount: float
    currency: str = "INR"
    failure_reason: Optional[str] = "payment_failed"
    failure_code: Optional[str] = "BAD_REQUEST_ERROR"
    raw_payload: Optional[Dict[str, Any]] = None

class AIDiagnosisOutput(BaseModel):
    diagnosis: str
    root_cause: str
    is_recoverable: bool
    recovery_probability: float = Field(..., ge=0.0, le=1.0)
    recommended_intervention: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    reasoning: str
    max_attempts: int = 3
    cooldown_hours: float = 4.0
    escalation_condition: str
    stop_condition: str

class PolicyValidationResult(BaseModel):
    is_approved: bool
    status_code: str
    gating_reason: str
    final_action: str
    modified_parameters: Optional[Dict[str, Any]] = None

class ActionExecutionRequest(BaseModel):
    case_id: str
    action_type: str
    parameters: Optional[Dict[str, Any]] = None

class PolicyConfigRequest(BaseModel):
    max_retries: int = 3
    max_reminders: int = 2
    cooldown_hours: float = 4.0
    max_autonomous_cap: float = 50000.0
    escalation_threshold: float = 50000.0
    require_approval_above: float = 30000.0

class BatchSimulationConfig(BaseModel):
    scenario_type: str = "MIXED_STORE"
    event_count: int = 20
    customer_count: int = 10
    recovery_optimism: float = 0.7

class BatchSimulationReport(BaseModel):
    total_events_processed: int
    total_revenue_at_risk: float
    estimated_recoverable_revenue: float
    total_revenue_recovered: float
    recovery_rate_percent: float
    successful_interventions: int
    failed_interventions: int
    escalated_cases: int
    stopped_cases: int
    roi_multiple: float
    recovery_by_type: Dict[str, float]
