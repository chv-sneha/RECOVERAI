import React from 'react';
import { X, Cpu, Clock, User } from 'lucide-react';
import type { RecoveryCase } from '../types';

interface CaseDetailModalProps {
  caseData: RecoveryCase | null;
  onClose: () => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({ caseData, onClose }) => {
  if (!caseData) return null;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{caseData.customer_name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {caseData.revenue_risk_type}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Case ID: {caseData.case_id} | TX: {caseData.transaction_id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 uppercase">Amount at Risk</span>
              <div className="text-lg font-black text-amber-400 mt-1">{formatINR(caseData.amount_at_risk)}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 uppercase">Est. Recoverable</span>
              <div className="text-lg font-black text-cyan-400 mt-1">{formatINR(caseData.estimated_recoverable)}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 uppercase">Recovery Prob</span>
              <div className="text-lg font-black text-emerald-400 mt-1">{Math.round(caseData.recoverability_score * 100)}%</div>
            </div>
          </div>

          {/* Why the Agent Chose This Action */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-cyan-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">Why the Agent Chose This Action</h4>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p><strong className="text-cyan-400">Diagnosis:</strong> {caseData.failure_reason}</p>
              <p><strong className="text-cyan-400">Intervention Selected:</strong> <code className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300">{caseData.current_action}</code></p>
              <p><strong className="text-cyan-400">Reasoning:</strong> High customer historical success rate (88%). Transient failure patterns recover efficiently via automated retry or smart payment link after cooldown.</p>
              <p><strong className="text-cyan-400">Policy Engine Gate:</strong> Amount ({formatINR(caseData.amount_at_risk)}) within ₹50,000 autonomous threshold. Retries count ({caseData.attempts_count}/{caseData.max_attempts}) OK.</p>
            </div>
          </div>

          {/* Chronological Customer Recovery Timeline */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Customer Recovery Timeline</span>
            </h4>

            <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
              {/* Event 1: Failure */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-amber-500 border-2 border-slate-900" />
                <div>
                  <span className="text-[10px] text-slate-500 font-mono">STEP 1 - EVENT INGESTED</span>
                  <h5 className="text-xs font-bold text-white mt-0.5">Payment Failure Detected</h5>
                  <p className="text-xs text-slate-400 mt-1">Webhook payment.failed received for {formatINR(caseData.amount_at_risk)}. Failure code: {caseData.failure_code || 'BAD_REQUEST_ERROR'}.</p>
                </div>
              </div>

              {/* Event 2: Diagnosis */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-purple-500 border-2 border-slate-900" />
                <div>
                  <span className="text-[10px] text-slate-500 font-mono">STEP 2 - AI DIAGNOSIS</span>
                  <h5 className="text-xs font-bold text-white mt-0.5">Structured AI Analysis</h5>
                  <p className="text-xs text-slate-400 mt-1">Calculated recovery probability: {Math.round(caseData.recoverability_score * 100)}%. Recommended intervention: {caseData.current_action}.</p>
                </div>
              </div>

              {/* Event 3: Policy Check */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-cyan-500 border-2 border-slate-900" />
                <div>
                  <span className="text-[10px] text-slate-500 font-mono">STEP 3 - POLICY GUARDRAIL</span>
                  <h5 className="text-xs font-bold text-white mt-0.5">Deterministic Guardrail Check</h5>
                  <p className="text-xs text-slate-400 mt-1">
                    {caseData.is_escalated 
                      ? `GATED: ${caseData.escalation_reason}`
                      : `APPROVED: Action complies with attempt limit (${caseData.attempts_count}/${caseData.max_attempts}), cooldown (${caseData.cooldown_hours}h), and cap.`}
                  </p>
                </div>
              </div>

              {/* Event 4: Action & Result */}
              <div className="relative">
                <span className={`absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-slate-900 ${
                  caseData.state === 'RECOVERED' ? 'bg-emerald-400' : 'bg-amber-400'
                }`} />
                <div>
                  <span className="text-[10px] text-slate-500 font-mono">STEP 4 - EXECUTION & OBSERVATION</span>
                  <h5 className="text-xs font-bold text-white mt-0.5">
                    {caseData.state === 'RECOVERED' ? 'Payment Successfully Captured!' : `Current State: ${caseData.state}`}
                  </h5>
                  <p className="text-xs text-slate-400 mt-1">
                    {caseData.state === 'RECOVERED'
                      ? `Razorpay sandbox payment link captured. ${formatINR(caseData.amount_at_risk)} credited into merchant settlement balance.`
                      : `Action executed. Monitoring for settlement callback.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-900">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition"
          >
            Close Timeline
          </button>
        </div>
      </div>
    </div>
  );
};
