import React, { useState } from 'react';
import { Layers, Search, Eye } from 'lucide-react';
import type { RecoveryCase } from '../types';

interface RecoveryCasesViewProps {
  cases: RecoveryCase[];
  onSelectCase: (c: RecoveryCase) => void;
}

export const RecoveryCasesView: React.FC<RecoveryCasesViewProps> = ({ cases, onSelectCase }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = 
      c.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.case_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || c.revenue_risk_type === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || c.state === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Recovery Cases Directory</h2>
            <p className="text-xs text-slate-400">
              Interactive queue of all autonomous cases across Payment Failures, Cart Abandonment, and Receivables.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
            {filteredCases.length} Cases Listed
          </div>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search customer, transaction ID, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
            {[
              { id: 'ALL', label: 'All Workflows' },
              { id: 'PAYMENT_FAILURE', label: 'Payment Failure' },
              { id: 'CHECKOUT_ABANDONMENT', label: 'Checkout Abandonment' },
              { id: 'B2B_RECEIVABLE', label: 'B2B Receivables' },
              { id: 'SUBSCRIPTION_FAILURE', label: 'Subscriptions' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedCategory(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === f.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Status Filter Pills */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-500 uppercase mr-1">Status:</span>
          {['ALL', 'RECOVERED', 'RETRY_REQUIRED', 'ESCALATED', 'STOPPED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                selectedStatus === st
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Cases Directory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Customer & Contact</th>
              <th className="py-3.5 px-4">Workflow & Failure Reason</th>
              <th className="py-3.5 px-4">Amount at Risk</th>
              <th className="py-3.5 px-4">Est. Recoverable ($E[R]$)</th>
              <th className="py-3.5 px-4">Recovery Score</th>
              <th className="py-3.5 px-4">Attempts</th>
              <th className="py-3.5 px-4">Current Action</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredCases.map((c) => (
              <tr key={c.case_id} className="hover:bg-slate-800/40 transition group">
                <td className="py-4 px-4">
                  <div className="font-bold text-white">{c.customer_name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{c.customer_email}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{c.transaction_id}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-400 border border-slate-700 w-fit mb-1">
                    {c.revenue_risk_type.replace('_', ' ')}
                  </div>
                  <div className="text-[11px] text-slate-300 max-w-xs">{c.failure_reason}</div>
                </td>
                <td className="py-4 px-4 font-bold text-amber-400">
                  {formatINR(c.amount_at_risk)}
                </td>
                <td className="py-4 px-4 font-bold text-cyan-400">
                  {formatINR(c.estimated_recoverable)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                        style={{ width: `${c.recoverability_score * 100}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-200">{Math.round(c.recoverability_score * 100)}%</span>
                  </div>
                </td>
                <td className="py-4 px-4 font-mono text-slate-300">
                  {c.attempts_count} / {c.max_attempts}
                </td>
                <td className="py-4 px-4">
                  <span className="font-mono text-slate-200 text-[11px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {c.current_action || 'DIAGNOSING'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    c.state === 'RECOVERED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : c.state === 'ESCALATED'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : c.state === 'STOPPED'
                      ? 'bg-slate-800 text-slate-400 border-slate-700'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                  }`}>
                    {c.state}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <button
                    onClick={() => onSelectCase(c)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 font-semibold transition flex items-center gap-1.5 ml-auto text-[11px]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Timeline</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
