import React from 'react';
import { AlertTriangle, ShieldCheck, Check, X } from 'lucide-react';
import type { RecoveryCase } from '../types';

interface HumanEscalationViewProps {
  cases: RecoveryCase[];
  onResolveEscalation: (caseId: string, action: 'APPROVE' | 'DISMISS') => void;
  onSelectCase: (c: RecoveryCase) => void;
}

export const HumanEscalationView: React.FC<HumanEscalationViewProps> = ({
  cases,
  onResolveEscalation,
  onSelectCase
}) => {
  const escalatedCases = cases.filter(c => c.state === 'ESCALATED' || c.is_escalated);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Human Escalation Queue</h2>
            <p className="text-xs text-slate-400">
              High-value cases, policy breaches, and customer disputes routed for merchant authorization.
            </p>
          </div>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
          {escalatedCases.length} Cases Requiring Human Approval
        </div>
      </div>

      {/* Escalation Queue Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        {escalatedCases.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-80" />
            <h4 className="text-sm font-bold text-white">No Pending Escalations</h4>
            <p className="text-xs text-slate-400 mt-1">All autonomous cases are operating within policy guardrails.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {escalatedCases.map((c) => (
              <div
                key={c.case_id}
                className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{c.customer_name}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      GATED
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                      {c.revenue_risk_type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium">
                    <strong className="text-rose-400">Reason:</strong> {c.escalation_reason || "Policy threshold breached."}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
                    <span>TX: {c.transaction_id}</span>
                    <span>Amount: <strong className="text-white">{formatINR(c.amount_at_risk)}</strong></span>
                    <span>Prob: <strong className="text-cyan-400">{Math.round(c.recoverability_score * 100)}%</strong></span>
                  </div>
                </div>

                {/* Merchant Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectCase(c)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition"
                  >
                    View Timeline
                  </button>
                  <button
                    onClick={() => onResolveEscalation(c.case_id, 'APPROVE')}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-emerald-900/30"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Override</span>
                  </button>
                  <button
                    onClick={() => onResolveEscalation(c.case_id, 'DISMISS')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Dismiss</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
