import type { RecoveryCase, DashboardMetrics, AuditLogItem, PolicyConfig, AgentActivityMessage } from './types';

export const initialPolicyConfig: PolicyConfig = {
  max_retries: 3,
  max_reminders: 2,
  cooldown_hours: 4.0,
  max_autonomous_cap: 50000.0,
  escalation_threshold: 50000.0,
  require_approval_above: 30000.0,
};

export const initialMetrics: DashboardMetrics = {
  total_revenue_at_risk: 1840000.0,
  estimated_recoverable_revenue: 1260000.0,
  revenue_recovered: 872000.0,
  recovery_rate_percent: 69.2,
  active_cases: 14,
  failed_recoveries: 3,
  escalations: 5,
  amount_saved: 872000.0,
  total_cases_count: 42
};

export const initialCases: RecoveryCase[] = [
  {
    case_id: "case_live_4999",
    customer_id: "cust_aarav_99",
    customer_name: "Aarav Sharma",
    customer_email: "aarav.sharma@techcorp.in",
    transaction_id: "pay_failed_8891",
    amount_at_risk: 4999.0,
    estimated_recoverable: 4499.1,
    revenue_risk_type: "PAYMENT_FAILURE",
    failure_reason: "Issuing Bank Downtime (Transient Timeout)",
    failure_code: "BAD_REQUEST_ERROR",
    risk_score: 0.10,
    recoverability_score: 0.90,
    urgency: "HIGH",
    attempts_count: 1,
    max_attempts: 3,
    cooldown_hours: 4.0,
    state: "RECOVERED",
    current_action: "RETRY_PAYMENT",
    is_escalated: false,
    created_at: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    case_id: "case_cart_18500",
    customer_id: "cust_priya_44",
    customer_name: "Priya Sharma",
    customer_email: "priya.s@retailhouse.com",
    transaction_id: "cart_abandoned_4012",
    amount_at_risk: 18500.0,
    estimated_recoverable: 14800.0,
    revenue_risk_type: "CHECKOUT_ABANDONMENT",
    failure_reason: "Cart Abandoned at 3DS Step",
    failure_code: "CHECKOUT_DROPOFF",
    risk_score: 0.20,
    recoverability_score: 0.80,
    urgency: "HIGH",
    attempts_count: 1,
    max_attempts: 2,
    cooldown_hours: 3.0,
    state: "RECOVERED",
    current_action: "GENERATE_PAYMENT_LINK",
    is_escalated: false,
    created_at: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    case_id: "case_b2b_85000",
    customer_id: "cust_vikram_12",
    customer_name: "Vikram Patel",
    customer_email: "vikram@designstudio.io",
    transaction_id: "inv_overdue_9918",
    amount_at_risk: 85000.0,
    estimated_recoverable: 59500.0,
    revenue_risk_type: "B2B_RECEIVABLE",
    failure_reason: "Invoice Overdue by 12 Days (Cap Exceeded)",
    failure_code: "RECEIVABLE_OVERDUE",
    risk_score: 0.30,
    recoverability_score: 0.70,
    urgency: "HIGH",
    attempts_count: 0,
    max_attempts: 3,
    cooldown_hours: 24.0,
    state: "ESCALATED",
    current_action: "ESCALATE_TO_HUMAN",
    is_escalated: true,
    escalation_reason: "Amount (₹85,000) exceeds autonomous recovery cap (₹50,000). Human approval required.",
    created_at: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    case_id: "case_sub_2499",
    customer_id: "cust_ananya_08",
    customer_name: "Ananya Roy",
    customer_email: "ananya@fintechlabs.in",
    transaction_id: "sub_failed_3301",
    amount_at_risk: 2499.0,
    estimated_recoverable: 1499.4,
    revenue_risk_type: "SUBSCRIPTION_FAILURE",
    failure_reason: "Insufficient Card Balance",
    failure_code: "RECURRING_AUTH_FAILED",
    risk_score: 0.40,
    recoverability_score: 0.60,
    urgency: "MEDIUM",
    attempts_count: 2,
    max_attempts: 3,
    cooldown_hours: 4.0,
    state: "RETRY_REQUIRED",
    current_action: "SEND_RECOVERY_NOTIFICATION",
    is_escalated: false,
    created_at: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    case_id: "case_pay_12500",
    customer_id: "cust_siddharth_21",
    customer_name: "Siddharth Verma",
    customer_email: "siddharth@cloudops.co",
    transaction_id: "pay_failed_1104",
    amount_at_risk: 12500.0,
    estimated_recoverable: 10625.0,
    revenue_risk_type: "PAYMENT_FAILURE",
    failure_reason: "3DS OTP Timeout",
    failure_code: "GATEWAY_TIMEOUT",
    risk_score: 0.15,
    recoverability_score: 0.85,
    urgency: "HIGH",
    attempts_count: 1,
    max_attempts: 3,
    cooldown_hours: 4.0,
    state: "RECOVERED",
    current_action: "GENERATE_PAYMENT_LINK",
    is_escalated: false,
    created_at: new Date(Date.now() - 3600 * 1000 * 15).toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const initialActivities: AgentActivityMessage[] = [
  {
    id: "act_1",
    timestamp: "15:28:10",
    case_id: "case_live_4999",
    message: "₹4,999 payment failure detected — Aarav Sharma",
    type: "DETECT",
    amount: 4999.0
  },
  {
    id: "act_2",
    timestamp: "15:28:12",
    case_id: "case_live_4999",
    message: "AI Diagnosis: Transient Issuing Bank Downtime (Recovery Prob: 90%)",
    type: "DIAGNOSE"
  },
  {
    id: "act_3",
    timestamp: "15:28:13",
    case_id: "case_live_4999",
    message: "Policy Guardrail: APPROVED (Cap ₹50,000 OK, Cooldown OK)",
    type: "POLICY"
  },
  {
    id: "act_4",
    timestamp: "15:28:15",
    case_id: "case_live_4999",
    message: "Executing Razorpay Sandbox Retry Payment...",
    type: "EXECUTE"
  },
  {
    id: "act_5",
    timestamp: "15:28:17",
    case_id: "case_live_4999",
    message: "SUCCESS! ₹4,999 fully recovered into merchant account.",
    type: "RECOVERED",
    amount: 4999.0
  }
];

export const initialAuditLogs: AuditLogItem[] = [
  {
    log_id: "log_901",
    case_id: "case_live_4999",
    timestamp: new Date().toISOString(),
    agent_reasoning: "Detected payment failure via Razorpay Webhook. Root cause: Issuing Bank Downtime.",
    policy_decision: "APPROVED",
    action_executed: "RETRY_PAYMENT",
    result_summary: "Razorpay sandbox transaction pay_captured_8891 succeeded.",
    state_from: "ACTION_EXECUTING",
    state_to: "RECOVERED"
  },
  {
    log_id: "log_902",
    case_id: "case_b2b_85000",
    timestamp: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    agent_reasoning: "Detected overdue B2B invoice ₹85,000. Customer: Vikram Patel (Design Studio).",
    policy_decision: "ESCALATED_HUMAN",
    action_executed: "ESCALATE_TO_HUMAN",
    result_summary: "Gated execution: Amount ₹85,000 exceeds merchant autonomous cap (₹50,000).",
    state_from: "POLICY_CHECK",
    state_to: "ESCALATED"
  }
];
