# RecoverAI — Real-Time Autonomous Revenue Recovery Agent

> **Razorpay Hackathon Track 03: AI Revenue Recovery**  
> **Central Claim**: *RecoverAI does not merely tell merchants that revenue is being lost. It continuously detects revenue leakage in real time, determines what is realistically recoverable, executes bounded recovery actions automatically via policy guardrails, measures actual money recovered, and stops safely when recovery is no longer appropriate.*

---

## 🚀 Key Features & Closed-Loop Agent Architecture

RecoverAI is built as a real-time, event-driven autonomous financial operations agent operating on a strict closed-loop state machine:

`EVENT → DETECT → DIAGNOSE → PREDICT → DECIDE → POLICY CHECK → ACT → OBSERVE → RECOVER / ESCALATE / STOP → AUDIT`

```
 ┌────────────────┐     ┌────────────────┐     ┌─────────────────┐
 │ Razorpay Event │ ──> │ Revenue Risk   │ ──> │ AI Diagnosis    │
 │ Stream / WS    │     │ Engine         │     │ Agent           │
 └────────────────┘     └────────────────┘     └─────────────────┘
                                                        │
 ┌────────────────┐     ┌────────────────┐              ▼
 │ Money Credit / │ <── │ Policy Engine  │ <── ┌─────────────────┐
 │ Audit Ledger   │     │ (Guardrails)   │     │ Action Proposal │
 └────────────────┘     └────────────────┘     └─────────────────┘
```

### 1. Unified Event Ingestion & Idempotency
- Ingests events: `payment.failed`, `checkout.abandoned`, `subscription.payment_failed`, `invoice.overdue`.
- Persists raw payload with unique event UUIDs to guarantee strict idempotency (prevents duplicate retries or repeated customer spamming).

### 2. Revenue Risk & Recoverability Calculation ($E[R]$)
- Distinguishes total revenue at risk from estimated recoverable revenue:
  $$\text{Estimated Recoverable Revenue } E[R] = \text{Amount at Risk} \times P(\text{Recovery Probability})$$

### 3. Structured AI Diagnosis Agent
- Employs constrained AI JSON schemas to evaluate root causes (e.g. transient issuing bank timeouts, 3DS authentication drop-offs, cart abandonment).
- Outputs structured recommendations (`RETRY_PAYMENT`, `GENERATE_PAYMENT_LINK`, `SEND_RECOVERY_NOTIFICATION`, `SEND_INVOICE_REMINDER`, `ESCALATE_TO_HUMAN`, `STOP_RECOVERY`).

### 4. Deterministic Policy Guardrail Engine
- The Policy Engine has final authority over execution and enforces hard business guardrails:
  - **Max Autonomous Cap**: Cases above ₹50,000 are automatically routed to the Human Escalation Queue.
  - **Max Retry Limit**: Maximum 3 automated retry attempts per case.
  - **Cooldown Windows**: Minimum 4-hour quiet window between communications.
  - **Stop Rules**: Halts immediately on fraud flags, active Promise-to-Pay, or explicit opt-out.

### 5. Multi-Workflow Support
- **Workflow 1: Payment Failure Recovery** — Detects payment failure → diagnoses issuing bank downtime → executes Razorpay Sandbox retry token → observes settlement.
- **Workflow 2: Checkout Abandonment Recovery** — Detects abandoned high-intent cart → generates 1-click Razorpay payment link → sends bounded reminder.
- **Workflow 3: B2B Receivables Recovery** — Analyzes overdue invoices → checks customer history → tracks Promise-to-Pay → escalates high-value receivables.

### 6. Hackathon Demonstration Modes
- **Simulate Single ₹4,999 Event**: Interactive step-by-step 1-click visual animation showing real-time state machine transitions.
- **Start Batch Simulation**: Runs multi-case transaction streams and computes a **Batch Recovery Report** comparing baseline loss vs recovered revenue, yield rate, and ROI multiple.

---

## 🛠️ Stack & Setup

- **Frontend**: React 19, Vite, Tailwind CSS, Recharts, Lucide Icons, WebSockets client.
- **Backend**: Python FastAPI, Uvicorn, WebSockets, SQLAlchemy, SQLite/PostgreSQL.

### Running Locally

1. **Backend Server**:
   ```bash
   python3 -m backend.seed
   python3 -m uvicorn backend.main:app --port 8000 --reload
   ```

2. **Frontend Development Server**:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5175/` in your browser.

---

## 📜 API Endpoints

- `GET /api/v1/metrics` — Top-level financial KPIs.
- `GET /api/v1/cases` — Active and historical recovery cases.
- `GET /api/v1/cases/{case_id}` — Customer recovery timeline & audit log.
- `POST /api/v1/events/webhook` — Razorpay webhook event ingestion.
- `POST /api/v1/simulation/single` — Triggers 1-click ₹4,999 recovery event.
- `POST /api/v1/simulation/batch` — Generates multi-case batch simulation report.
- `GET /api/v1/policy` & `POST /api/v1/policy` — Merchant Policy Control Center.
- `GET /ws/events` — Real-Time WebSocket event broadcast stream.
