import datetime
import uuid
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class MerchantAccountModel(Base):
    __tablename__ = "merchant_accounts"

    id = Column(Integer, primary_key=True, index=True)
    merchant_id = Column(String, unique=True, index=True, default=lambda: f"mch_{uuid.uuid4().hex[:8]}")
    name = Column(String, default="Rajesh Kumar")
    company_name = Column(String, default="TechCorp India Pvt Ltd")
    email = Column(String, unique=True, index=True, default="rajesh@techcorp.in")
    razorpay_key_id = Column(String, nullable=True)
    razorpay_key_secret = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    last_login_at = Column(DateTime, default=datetime.datetime.utcnow)

class EventModel(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String, unique=True, index=True, default=lambda: f"evt_{uuid.uuid4().hex[:12]}")
    event_type = Column(String, index=True)
    source = Column(String, default="RAZORPAY_WEBHOOK")  # RAZORPAY_WEBHOOK, SIMULATOR, MANUAL
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    customer_id = Column(String, index=True)
    order_id = Column(String, nullable=True)
    payment_id = Column(String, nullable=True)
    amount = Column(Float, default=0.0)
    currency = Column(String, default="INR")
    raw_payload = Column(JSON, nullable=True)

class RecoveryCaseModel(Base):
    __tablename__ = "recovery_cases"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String, unique=True, index=True, default=lambda: f"case_{uuid.uuid4().hex[:12]}")
    customer_id = Column(String, index=True)
    customer_name = Column(String, default="Merchant Customer")
    customer_email = Column(String, default="customer@example.com")
    transaction_id = Column(String, index=True)
    amount_at_risk = Column(Float, default=0.0)
    estimated_recoverable = Column(Float, default=0.0)
    revenue_risk_type = Column(String, index=True)  # PAYMENT_FAILURE, CHECKOUT_ABANDONMENT, B2B_RECEIVABLE, SUBSCRIPTION_FAILURE
    failure_reason = Column(String, default="UNKNOWN")
    failure_code = Column(String, nullable=True)
    risk_score = Column(Float, default=0.5)
    recoverability_score = Column(Float, default=0.5)
    urgency = Column(String, default="MEDIUM")  # LOW, MEDIUM, HIGH, CRITICAL
    attempts_count = Column(Integer, default=0)
    max_attempts = Column(Integer, default=3)
    cooldown_hours = Column(Float, default=4.0)
    state = Column(String, default="NEW")  # NEW, DETECTED, DIAGNOSING, DECISION_PENDING, POLICY_CHECK, ACTION_SCHEDULED, ACTION_EXECUTING, WAITING_FOR_RESULT, RECOVERED, RETRY_REQUIRED, ESCALATED, FAILED, STOPPED
    current_action = Column(String, nullable=True)
    next_action_due = Column(DateTime, nullable=True)
    is_escalated = Column(Boolean, default=False)
    escalation_reason = Column(String, nullable=True)
    promise_to_pay_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    actions = relationship("ActionModel", back_populates="case", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLogModel", back_populates="case", cascade="all, delete-orphan")

class ActionModel(Base):
    __tablename__ = "actions"

    id = Column(Integer, primary_key=True, index=True)
    action_id = Column(String, unique=True, index=True, default=lambda: f"act_{uuid.uuid4().hex[:12]}")
    case_id = Column(String, ForeignKey("recovery_cases.case_id"))
    action_type = Column(String)  # RETRY_PAYMENT, GENERATE_PAYMENT_LINK, SEND_RECOVERY_NOTIFICATION, SEND_INVOICE_REMINDER, RECORD_PROMISE_TO_PAY, ESCALATE_TO_HUMAN, STOP_RECOVERY
    parameters = Column(JSON, nullable=True)
    agent_decision = Column(JSON, nullable=True)
    policy_validation_result = Column(JSON, nullable=True)
    execution_result = Column(JSON, nullable=True)
    external_api_ref = Column(String, nullable=True)  # e.g., Razorpay Payment Link ID
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    case = relationship("RecoveryCaseModel", back_populates="actions")

class PolicyConfigModel(Base):
    __tablename__ = "policy_configs"

    id = Column(Integer, primary_key=True, index=True)
    max_retries = Column(Integer, default=3)
    max_reminders = Column(Integer, default=2)
    cooldown_hours = Column(Float, default=4.0)
    max_autonomous_cap = Column(Float, default=50000.0)  # Max amount in INR for auto action
    escalation_threshold = Column(Float, default=50000.0)
    require_approval_above = Column(Float, default=30000.0)
    is_active = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    log_id = Column(String, unique=True, index=True, default=lambda: f"log_{uuid.uuid4().hex[:12]}")
    case_id = Column(String, ForeignKey("recovery_cases.case_id"), nullable=True)
    event_id = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    agent_reasoning = Column(Text, nullable=True)
    policy_decision = Column(String, default="APPROVED")  # APPROVED, GATED_PASSED, REJECTED, ESCALATED
    action_executed = Column(String, nullable=True)
    result_summary = Column(Text, nullable=True)
    state_from = Column(String, nullable=True)
    state_to = Column(String, nullable=True)

    case = relationship("RecoveryCaseModel", back_populates="audit_logs")

class CustomerHistoryModel(Base):
    __tablename__ = "customer_histories"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String, unique=True, index=True)
    name = Column(String)
    email = Column(String)
    segment = Column(String, default="REGULAR")  # VIP, ENTERPRISE, REGULAR, NEW, HIGH_RISK
    success_rate = Column(Float, default=0.85)
    avg_payment_delay_days = Column(Float, default=1.5)
    previous_failures_count = Column(Integer, default=1)
    recovered_failures_count = Column(Integer, default=1)
    total_order_value = Column(Float, default=25000.0)
    communication_response_rate = Column(Float, default=0.75)
