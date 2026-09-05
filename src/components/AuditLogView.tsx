import React from 'react';
import { FileText, Lock } from 'lucide-react';
import type { AuditLogItem } from '../types';

interface AuditLogViewProps {
  logs: AuditLogItem[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Immutable Agent Audit Trail</h2>
            <p className="text-xs text-slate-400">
              Complete explainability log documenting every AI decision, policy check, and money action.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
          <Lock className="w-4 h-4 text-cyan-400" />
          <span>Cryptographic Ledger Hash Valid</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Log ID & Timestamp</th>
              <th className="py-3.5 px-4">Case Ref</th>
              <th className="py-3.5 px-4">Agent Reasoning Summary</th>
              <th className="py-3.5 px-4">Policy Decision</th>
              <th className="py-3.5 px-4">Executed Action</th>
              <th className="py-3.5 px-4">State Transition</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {logs.map((l) => (
              <tr key={l.log_id} className="hover:bg-slate-800/40 transition">
                <td className="py-4 px-4 font-mono text-slate-300">
                  <div className="font-bold text-cyan-400">{l.log_id}</div>
                  <div className="text-[10px] text-slate-500">{new Date(l.timestamp).toLocaleTimeString()}</div>
                </td>
                <td className="py-4 px-4 font-mono text-slate-400">
                  {l.case_id || 'SYSTEM'}
                </td>
                <td className="py-4 px-4 max-w-xs text-slate-300 font-medium">
                  {l.agent_reasoning}
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    l.policy_decision === 'APPROVED' || l.policy_decision === 'GATED_PASSED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {l.policy_decision}
                  </span>
                </td>
                <td className="py-4 px-4 font-mono text-slate-200">
                  {l.action_executed || 'NO_ACTION'}
                </td>
                <td className="py-4 px-4">
                  <span className="text-[11px] font-mono text-slate-400">
                    {l.state_from} → <strong className="text-white">{l.state_to}</strong>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
