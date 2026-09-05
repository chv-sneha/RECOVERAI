import React from 'react';
import { 
  TrendingUp, ShieldAlert, CheckCircle2, 
  AlertTriangle, RefreshCw, Eye, Zap 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import type { RecoveryCase, DashboardMetrics, AgentActivityMessage } from '../types';

interface DashboardViewProps {
  metrics: DashboardMetrics;
  cases: RecoveryCase[];
  activities: AgentActivityMessage[];
  onSelectCase: (c: RecoveryCase) => void;
  onFilterType: (type: string) => void;
  selectedRiskType: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  cases,
  activities,
  onSelectCase,
  onFilterType,
  selectedRiskType
}) => {
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const funnelData = [
    { stage: 'Revenue at Risk', value: metrics.total_revenue_at_risk, color: '#f59e0b' },
    { stage: 'Est. Recoverable', value: metrics.estimated_recoverable_revenue, color: '#3b82f6' },
    { stage: 'Interventions', value: metrics.estimated_recoverable_revenue * 0.85, color: '#8b5cf6' },
    { stage: 'Money Recovered', value: metrics.revenue_recovered, color: '#10b981' },
  ];

  const filteredCases = selectedRiskType === 'ALL' 
    ? cases 
    : cases.filter(c => c.revenue_risk_type === selectedRiskType);

  return (
    <div className="space-y-6">
      {/* Top Financial KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue at Risk */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Revenue at Risk</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight mb-1">
            {formatINR(metrics.total_revenue_at_risk)}
          </div>
          <p className="text-xs text-amber-400/90 flex items-center gap-1 font-medium">
            <span>{metrics.total_cases_count} cases detected across channels</span>
          </p>
        </div>

        {/* Estimated Recoverable Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Est. Recoverable</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight mb-1">
            {formatINR(metrics.estimated_recoverable_revenue)}
          </div>
          <p className="text-xs text-blue-400/90 flex items-center gap-1 font-medium">
            <span>E[R] = Amount × P(Recovery)</span>
          </p>
        </div>

        {/* Total Revenue Recovered */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Revenue Recovered</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 tracking-tight mb-1">
            {formatINR(metrics.revenue_recovered)}
          </div>
          <p className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
            <span>{metrics.recovery_rate_percent}% Recovery Rate</span>
          </p>
        </div>

        {/* Escalated / Active Cases */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active & Escalated</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight mb-1">
            {metrics.active_cases} Active / {metrics.escalations} Escalated
          </div>
          <p className="text-xs text-purple-400 flex items-center gap-1 font-medium">
            <span>Amount Saved: {formatINR(metrics.amount_saved)}</span>
          </p>
        </div>
      </div>

      {/* Main Section: Funnel Chart & Real-Time Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Recovery Funnel */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Revenue Recovery Funnel</h3>
              <p className="text-xs text-slate-400">Conversion breakdown from detection to recovered money</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              {metrics.recovery_rate_percent}% Yield
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} stroke="#94a3b8" />
                <YAxis dataKey="stage" type="category" stroke="#cbd5e1" width={110} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(val: any) => [formatINR(Number(val) || 0), 'Amount']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Agent Activity Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-80 lg:h-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-base font-bold text-white">Agent Live Stream</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Real-Time Events</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-start gap-3 transition hover:border-slate-600"
              >
                <div className="mt-0.5">
                  {act.type === 'DETECT' && <ShieldAlert className="w-4 h-4 text-amber-400" />}
                  {act.type === 'DIAGNOSE' && <Zap className="w-4 h-4 text-purple-400" />}
                  {act.type === 'POLICY' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  {act.type === 'EXECUTE' && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />}
                  {act.type === 'RECOVERED' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {act.type === 'ESCALATED' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">{act.message}</p>
                  <span className="text-[10px] text-slate-500 font-mono">{act.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filterable Recovery Cases Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Autonomous Recovery Cases</h3>
            <p className="text-xs text-slate-400">Live cases monitored by RecoverAI event loop</p>
          </div>

          {/* Workflow Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'ALL', label: 'All Workflows' },
              { id: 'PAYMENT_FAILURE', label: 'Payment Failure' },
              { id: 'CHECKOUT_ABANDONMENT', label: 'Checkout Abandonment' },
              { id: 'B2B_RECEIVABLE', label: 'B2B Receivables' },
              { id: 'SUBSCRIPTION_FAILURE', label: 'Subscriptions' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => onFilterType(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedRiskType === f.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Customer & Case</th>
                <th className="py-3.5 px-4">Workflow</th>
                <th className="py-3.5 px-4">Amount at Risk</th>
                <th className="py-3.5 px-4">Est. Recoverable</th>
                <th className="py-3.5 px-4">Recovery Prob</th>
                <th className="py-3.5 px-4">Current Action</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredCases.map((c) => (
                <tr key={c.case_id} className="hover:bg-slate-800/40 transition group">
                  <td className="py-4 px-4">
                    <div className="font-bold text-white">{c.customer_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{c.transaction_id}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {c.revenue_risk_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-200">
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
                      <span className="font-bold text-slate-300">{Math.round(c.recoverability_score * 100)}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-mono text-slate-300 text-[11px]">
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
    </div>
  );
};
