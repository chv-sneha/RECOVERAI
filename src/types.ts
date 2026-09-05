export type RevenueRiskType = 
  | 'PAYMENT_FAILURE' 
  | 'CHECKOUT_ABANDONMENT' 
  | 'B2B_RECEIVABLE' 
  | 'SUBSCRIPTION_FAILURE';

export type CaseState = 
  | 'NEW'
  | 'DETECTED'
  | 'DIAGNOSING'
  | 'DECISION_PENDING'
  | 'POLICY_CHECK'
  | 'ACTION_SCHEDULED'
  | 'ACTION_EXECUTING'
  | 'WAITING_FOR_RESULT'
  | 'RECOVERED'
  | 'RETRY_REQUIRED'
  | 'ESCALATED'
  | 'FAILED'
  | 'STOPPED';

export interface AIDiagnosis {
  diagnosis: string;
  root_cause: string;
  is_recoverable: boolean;
  recovery_probability: number;
  recommended_intervention: string;
  confidence: number;
  reasoning: string;
  max_attempts: number;
  cooldown_hours: number;
  escalation_condition: string;
  stop_condition: string;
}

export interface PolicyValidation {
  is_approved: boolean;
  status_code: 'APPROVED' | 'GATED_PASSED' | 'REJECTED_MAX_RETRIES' | 'REJECTED_CAP_EXCEEDED' | 'REJECTED_COOLDOWN' | 'ESCALATED_HUMAN';
  gating_reason: string;
  final_action: string;
}

export interface ActionRecord {
  action_id: string;
  case_id: string;
  action_type: string;
  parameters?: Record<string, any>;
  agent_decision?: AIDiagnosis;
  policy_validation_result?: PolicyValidation;
  execution_result?: Record<string, any>;
  external_api_ref?: string;
  timestamp: string;
}

export interface RecoveryCase {
  case_id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  transaction_id: string;
  amount_at_risk: number;
  estimated_recoverable: number;
  revenue_risk_type: RevenueRiskType;
  failure_reason: string;
  failure_code?: string;
  risk_score: number;
  recoverability_score: number;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  attempts_count: number;
  max_attempts: number;
  cooldown_hours: number;
  state: CaseState;
  current_action?: string;
  next_action_due?: string;
  is_escalated: boolean;
  escalation_reason?: string;
  created_at: string;
  updated_at: string;
  actions?: ActionRecord[];
  audit_logs?: AuditLogItem[];
}

export interface AuditLogItem {
  log_id: string;
  case_id?: string;
  event_id?: string;
  timestamp: string;
  agent_reasoning: string;
  policy_decision: string;
  action_executed: string;
  result_summary: string;
  state_from: string;
  state_to: string;
}

export interface PolicyConfig {
  max_retries: number;
  max_reminders: number;
  cooldown_hours: number;
  max_autonomous_cap: number;
  escalation_threshold: number;
  require_approval_above: number;
}

export interface DashboardMetrics {
  total_revenue_at_risk: number;
  estimated_recoverable_revenue: number;
  revenue_recovered: number;
  recovery_rate_percent: number;
  active_cases: number;
  failed_recoveries: number;
  escalations: number;
  amount_saved: number;
  total_cases_count: number;
}

export interface AgentActivityMessage {
  id: string;
  timestamp: string;
  case_id?: string;
  message: string;
  type: 'DETECT' | 'DIAGNOSE' | 'POLICY' | 'EXECUTE' | 'RECOVERED' | 'ESCALATED' | 'STOPPED';
  amount?: number;
}

export interface BatchReport {
  total_events_processed: number;
  total_revenue_at_risk: number;
  estimated_recoverable_revenue: number;
  total_revenue_recovered: number;
  recovery_rate_percent: number;
  successful_interventions: number;
  failed_interventions: number;
  escalated_cases: number;
  stopped_cases: number;
  roi_multiple: number;
  recovery_by_type: Record<string, number>;
}
