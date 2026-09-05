import datetime
import random
import uuid
from .database import engine, SessionLocal, Base
from .models import (
    EventModel, RecoveryCaseModel, ActionModel, 
    AuditLogModel, PolicyConfigModel, CustomerHistoryModel
)

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(RecoveryCaseModel).count() > 0:
        print("Database already contains seed data.")
        db.close()
        return

    print("Seeding initial RecoverAI dataset...")

    # Default Policy Config
    policy = PolicyConfigModel(
        max_retries=3,
        max_reminders=2,
        cooldown_hours=4.0,
        max_autonomous_cap=50000.0,
        escalation_threshold=50000.0,
        require_approval_above=30000.0
    )
    db.add(policy)

    # Seed Customers
    customers_data = [
        {"id": "cust_101", "name": "Rajesh Kumar", "email": "rajesh@techcorp.in", "segment": "ENTERPRISE", "success": 0.92},
        {"id": "cust_102", "name": "Priya Sharma", "email": "priya.s@retailhouse.com", "segment": "VIP", "success": 0.88},
        {"id": "cust_103", "name": "Vikram Patel", "email": "vikram@designstudio.io", "segment": "REGULAR", "success": 0.75},
        {"id": "cust_104", "name": "Ananya Roy", "email": "ananya@fintechlabs.in", "segment": "HIGH_RISK", "success": 0.55},
        {"id": "cust_105", "name": "Siddharth Verma", "email": "siddharth@cloudops.co", "segment": "REGULAR", "success": 0.82},
    ]

    for c in customers_data:
        cust = CustomerHistoryModel(
            customer_id=c["id"],
            name=c["name"],
            email=c["email"],
            segment=c["segment"],
            success_rate=c["success"],
            avg_payment_delay_days=1.5,
            previous_failures_count=random.randint(1, 4),
            recovered_failures_count=random.randint(1, 3),
            total_order_value=random.uniform(15000, 250000)
        )
        db.add(cust)

    db.commit()

    # Seed Cases across Workflow 1, 2, 3
    initial_cases = [
        {
            "customer_id": "cust_101",
            "name": "Rajesh Kumar",
            "email": "rajesh@techcorp.in",
            "tx_id": "pay_failed_8821",
            "amount": 4999.0,
            "est": 4499.1,
            "risk_type": "PAYMENT_FAILURE",
            "reason": "Issuing Bank Downtime (Transient Timeout)",
            "risk_score": 0.10,
            "rec_score": 0.90,
            "urgency": "HIGH",
            "attempts": 1,
            "state": "RECOVERED",
            "current_action": "RETRY_PAYMENT"
        },
        {
            "customer_id": "cust_102",
            "name": "Priya Sharma",
            "email": "priya.s@retailhouse.com",
            "tx_id": "cart_abandoned_4012",
            "amount": 18500.0,
            "est": 14800.0,
            "risk_type": "CHECKOUT_ABANDONMENT",
            "reason": "Cart Abandoned at 3DS Step",
            "risk_score": 0.20,
            "rec_score": 0.80,
            "urgency": "HIGH",
            "attempts": 1,
            "state": "RECOVERED",
            "current_action": "GENERATE_PAYMENT_LINK"
        },
        {
            "customer_id": "cust_103",
            "name": "Vikram Patel",
            "email": "vikram@designstudio.io",
            "tx_id": "inv_overdue_9918",
            "amount": 85000.0,
            "est": 59500.0,
            "risk_type": "B2B_RECEIVABLE",
            "reason": "Invoice Overdue by 12 Days",
            "risk_score": 0.30,
            "rec_score": 0.70,
            "urgency": "HIGH",
            "attempts": 0,
            "state": "ESCALATED",
            "current_action": "ESCALATE_TO_HUMAN",
            "is_escalated": True,
            "escalation_reason": "Amount (₹85,000) exceeds autonomous cap policy threshold (₹50,000)."
        },
        {
            "customer_id": "cust_104",
            "name": "Ananya Roy",
            "email": "ananya@fintechlabs.in",
            "tx_id": "sub_failed_3301",
            "amount": 2499.0,
            "est": 1499.4,
            "risk_type": "SUBSCRIPTION_FAILURE",
            "reason": "Insufficient Card Balance",
            "risk_score": 0.40,
            "rec_score": 0.60,
            "urgency": "MEDIUM",
            "attempts": 2,
            "state": "RETRY_REQUIRED",
            "current_action": "SEND_RECOVERY_NOTIFICATION"
        },
        {
            "customer_id": "cust_105",
            "name": "Siddharth Verma",
            "email": "siddharth@cloudops.co",
            "tx_id": "pay_failed_1104",
            "amount": 12500.0,
            "est": 10625.0,
            "risk_type": "PAYMENT_FAILURE",
            "reason": "3DS OTP Timeout",
            "risk_score": 0.15,
            "rec_score": 0.85,
            "urgency": "HIGH",
            "attempts": 1,
            "state": "RECOVERED",
            "current_action": "GENERATE_PAYMENT_LINK"
        }
    ]

    for data in initial_cases:
        case = RecoveryCaseModel(
            customer_id=data["customer_id"],
            customer_name=data["name"],
            customer_email=data["email"],
            transaction_id=data["tx_id"],
            amount_at_risk=data["amount"],
            estimated_recoverable=data["est"],
            revenue_risk_type=data["risk_type"],
            failure_reason=data["reason"],
            risk_score=data["risk_score"],
            recoverability_score=data["rec_score"],
            urgency=data["urgency"],
            attempts_count=data["attempts"],
            state=data["state"],
            current_action=data["current_action"],
            is_escalated=data.get("is_escalated", False),
            escalation_reason=data.get("escalation_reason", None)
        )
        db.add(case)
        db.commit()
        db.refresh(case)

        # Audit entry
        audit = AuditLogModel(
            case_id=case.case_id,
            agent_reasoning=f"Initial seed workflow for {case.revenue_risk_type}. Diagnosis score: {case.recoverability_score}",
            policy_decision="APPROVED" if not case.is_escalated else "ESCALATED_HUMAN",
            action_executed=case.current_action,
            result_summary=f"State set to {case.state}",
            state_from="NEW",
            state_to=case.state
        )
        db.add(audit)

    db.commit()
    db.close()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    seed_database()
