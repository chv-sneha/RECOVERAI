import asyncio
import json
import hmac
import hashlib
import os
import uuid
from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, get_db, Base
from .models import (
    EventModel, RecoveryCaseModel, ActionModel, 
    PolicyConfigModel, AuditLogModel, CustomerHistoryModel
)
from .schemas import (
    WebhookEventPayload, PolicyConfigRequest, 
    BatchSimulationConfig, BatchSimulationReport
)
from .services.orchestrator import RecoveryOrchestrator
from .services.simulator import run_batch_simulation
from .services.razorpay_adapter import test_razorpay_connection, is_real_razorpay_configured

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="RecoverAI - Autonomous Revenue Recovery Engine API",
    description="Razorpay Track 03 AI Revenue Recovery Backend Services",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server & production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Real-Time WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        dead_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                dead_connections.append(connection)
        for dead in dead_connections:
            self.disconnect(dead)

manager = ConnectionManager()

@app.websocket("/ws/events")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep-alive loop
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Health check
@app.get("/health")
def health_check():
    return {"status": "HEALTHY", "agent": "RecoverAI Real-Time Engine v1.0"}

# Merchant Razorpay Integration Connection Status Endpoint
@app.get("/api/v1/merchant/status")
def get_merchant_status():
    status = test_razorpay_connection()
    status["webhook_endpoint"] = "http://127.0.0.1:8000/api/v1/events/webhook"
    status["webhook_secret_configured"] = bool(os.getenv("RAZORPAY_WEBHOOK_SECRET"))
    return status

# Dashboard Financial KPIs Endpoint
@app.get("/api/v1/metrics")
def get_dashboard_metrics(db: Session = Depends(get_db)):
    cases = db.query(RecoveryCaseModel).all()
    
    total_risk = sum(c.amount_at_risk for c in cases)
    est_recoverable = sum(c.estimated_recoverable for c in cases)
    recovered_cases = [c for c in cases if c.state == "RECOVERED"]
    total_recovered = sum(c.amount_at_risk for c in recovered_cases)
    
    active_cases = len([c for c in cases if c.state in ["DETECTED", "DIAGNOSING", "ACTION_EXECUTING", "RETRY_REQUIRED"]])
    escalated_cases = len([c for c in cases if c.state == "ESCALATED"])
    failed_cases = len([c for c in cases if c.state in ["STOPPED", "FAILED"]])
    
    recovery_rate = (total_recovered / total_risk * 100.0) if total_risk > 0 else 0.0
    amount_saved = total_recovered
    
    return {
        "total_revenue_at_risk": round(total_risk, 2),
        "estimated_recoverable_revenue": round(est_recoverable, 2),
        "revenue_recovered": round(total_recovered, 2),
        "recovery_rate_percent": round(recovery_rate, 1),
        "active_cases": active_cases,
        "failed_recoveries": failed_cases,
        "escalations": escalated_cases,
        "amount_saved": round(amount_saved, 2),
        "total_cases_count": len(cases)
    }

# Recovery Cases Endpoint
@app.get("/api/v1/cases")
def list_cases(risk_type: str = None, state: str = None, db: Session = Depends(get_db)):
    query = db.query(RecoveryCaseModel)
    if risk_type:
        query = query.filter(RecoveryCaseModel.revenue_risk_type == risk_type)
    if state:
        query = query.filter(RecoveryCaseModel.state == state)
    cases = query.order_by(RecoveryCaseModel.created_at.desc()).all()
    return cases

# Single Case Detail + Timeline + Audit Endpoint
@app.get("/api/v1/cases/{case_id}")
def get_case_detail(case_id: str, db: Session = Depends(get_db)):
    case = db.query(RecoveryCaseModel).filter(RecoveryCaseModel.case_id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    actions = db.query(ActionModel).filter(ActionModel.case_id == case_id).order_by(ActionModel.timestamp.asc()).all()
    audit_logs = db.query(AuditLogModel).filter(AuditLogModel.case_id == case_id).order_by(AuditLogModel.timestamp.asc()).all()
    
    return {
        "case": case,
        "actions": actions,
        "audit_logs": audit_logs
    }

# Webhook Event Ingestion Endpoint (Supports raw Razorpay Webhooks & Structured Payloads)
@app.post("/api/v1/events/webhook")
async def ingest_webhook_event(
    request: Request,
    x_razorpay_signature: str = Header(None),
    db: Session = Depends(get_db)
):
    body_bytes = await request.body()
    webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")
    
    # HMAC Signature Verification if signature header and secret are present
    if x_razorpay_signature and webhook_secret:
        expected_sig = hmac.new(
            webhook_secret.encode('utf-8'), 
            body_bytes, 
            hashlib.sha256
        ).hexdigest()
        if not hmac.compare_digest(expected_sig, x_razorpay_signature):
            raise HTTPException(status_code=400, detail="Invalid Razorpay webhook HMAC signature.")

    try:
        json_data = json.loads(body_bytes.decode('utf-8'))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body.")

    # Parse Razorpay event or direct schema payload
    event_type = json_data.get("event", json_data.get("event_type", "payment.failed"))
    payload_data = json_data.get("payload", {})
    
    orchestrator = RecoveryOrchestrator(db, websocket_broadcast_func=manager.broadcast)
    
    # Handle Outcome Webhooks (e.g. payment_link.paid or payment.captured)
    if event_type in ["payment_link.paid", "payment.captured"]:
        entity = payload_data.get("payment_link", {}).get("entity", {}) or payload_data.get("payment", {}).get("entity", {})
        link_id = entity.get("id") or entity.get("payment_link_id")
        
        # Locate matching case
        case = None
        if link_id:
            action_rec = db.query(ActionModel).filter(ActionModel.external_api_ref == link_id).first()
            if action_rec:
                case = db.query(RecoveryCaseModel).filter(RecoveryCaseModel.case_id == action_rec.case_id).first()
        
        if not case:
            # Fallback locate by transaction ID
            tx_id = entity.get("payment_id") or entity.get("order_id")
            if tx_id:
                case = db.query(RecoveryCaseModel).filter(RecoveryCaseModel.transaction_id == tx_id).first()
                
        if case and case.state != "RECOVERED":
            case.state = "RECOVERED"
            db.commit()
            
            audit = AuditLogModel(
                case_id=case.case_id,
                agent_reasoning="Razorpay webhook payment_link.paid / payment.captured received.",
                policy_decision="APPROVED",
                action_executed=case.current_action or "GENERATE_PAYMENT_LINK",
                result_summary=f"SUCCESS: ₹{case.amount_at_risk:,.2f} recovered via live Razorpay webhook.",
                state_from="ACTION_EXECUTING",
                state_to="RECOVERED"
            )
            db.add(audit)
            db.commit()
            
            await manager.broadcast({
                "type": "REVENUE_RECOVERED",
                "timestamp": asyncio.get_event_loop().time(),
                "data": {
                    "case_id": case.case_id,
                    "amount_recovered": case.amount_at_risk,
                    "action_type": case.current_action,
                    "customer_name": case.customer_name
                }
            })
            return {"status": "SUCCESS", "case_id": case.case_id, "state": "RECOVERED"}

    # Handle Failure Ingestion Event
    if "payload" in json_data and "payment" in json_data["payload"]:
        p_entity = json_data["payload"]["payment"]["entity"]
        norm_payload = WebhookEventPayload(
            event_type=event_type,
            source="RAZORPAY_REAL_WEBHOOK",
            customer_id=p_entity.get("customer_id") or f"cust_rzp_{uuid.uuid4().hex[:6]}",
            customer_name=p_entity.get("notes", {}).get("customer_name") or "Razorpay Customer",
            customer_email=p_entity.get("email") or "customer@example.com",
            order_id=p_entity.get("order_id"),
            payment_id=p_entity.get("id"),
            amount=float(p_entity.get("amount", 0)) / 100.0,
            currency=p_entity.get("currency", "INR"),
            failure_reason=p_entity.get("error_description") or p_entity.get("error_reason") or "Payment Failure",
            failure_code=p_entity.get("error_code") or "BAD_REQUEST_ERROR",
            raw_payload=json_data
        )
    else:
        # Pydantic dict payload fallback
        norm_payload = WebhookEventPayload(**json_data)

    case = await orchestrator.process_incoming_event(norm_payload)
    return {"status": "SUCCESS", "case_id": case.case_id if case else None, "state": case.state if case else None}

# Trigger Single Live Recovery Simulation Event
@app.post("/api/v1/simulation/single")
async def trigger_single_event_simulation(db: Session = Depends(get_db)):
    orchestrator = RecoveryOrchestrator(db, websocket_broadcast_func=manager.broadcast)
    
    # Generate realistic ₹4,999 single event failure
    payload = WebhookEventPayload(
        event_type="payment.failed",
        source="SIMULATOR_SINGLE",
        customer_id=f"cust_live_{uuid.uuid4().hex[:6]}",
        customer_name="Aarav Sharma",
        customer_email="aarav.sharma@example.com",
        order_id=f"order_{uuid.uuid4().hex[:8]}",
        payment_id=f"pay_{uuid.uuid4().hex[:8]}",
        amount=4999.0,
        currency="INR",
        failure_reason="INSUFFICIENT_FUNDS_TRANSIENT",
        failure_code="BAD_REQUEST_ERROR"
    )
    
    case = await orchestrator.process_incoming_event(payload)
    return {"status": "SUCCESS", "case_id": case.case_id, "amount": 4999.0, "state": case.state}

# Batch Simulation Endpoint
@app.post("/api/v1/simulation/batch")
async def run_batch_sim(config: BatchSimulationConfig, db: Session = Depends(get_db)):
    report = await run_batch_simulation(db, config, broadcast_func=manager.broadcast)
    return report

# Policy Settings API
@app.get("/api/v1/policy")
def get_policy(db: Session = Depends(get_db)):
    policy = db.query(PolicyConfigModel).filter(PolicyConfigModel.is_active == True).first()
    if not policy:
        policy = PolicyConfigModel()
        db.add(policy)
        db.commit()
        db.refresh(policy)
    return policy

@app.post("/api/v1/policy")
def update_policy(req: PolicyConfigRequest, db: Session = Depends(get_db)):
    policy = db.query(PolicyConfigModel).filter(PolicyConfigModel.is_active == True).first()
    if not policy:
        policy = PolicyConfigModel()
        db.add(policy)
    
    policy.max_retries = req.max_retries
    policy.max_reminders = req.max_reminders
    policy.cooldown_hours = req.cooldown_hours
    policy.max_autonomous_cap = req.max_autonomous_cap
    policy.escalation_threshold = req.escalation_threshold
    policy.require_approval_above = req.require_approval_above
    db.commit()
    db.refresh(policy)
    return policy

# Audit Logs API
@app.get("/api/v1/audit-logs")
def get_audit_logs(limit: int = 50, db: Session = Depends(get_db)):
    logs = db.query(AuditLogModel).order_by(AuditLogModel.timestamp.desc()).limit(limit).all()
    return logs
