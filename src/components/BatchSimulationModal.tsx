import React, { useState } from 'react';
import { Zap, X, Play, RefreshCw, BarChart2 } from 'lucide-react';
import type { BatchReport } from '../types';

interface BatchSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunBatch: (scenarioType: string, eventCount: number) => Promise<BatchReport>;
}

export const BatchSimulationModal: React.FC<BatchSimulationModalProps> = ({
  isOpen,
  onClose,
  onRunBatch
}) => {
  const [scenarioType, setScenarioType] = useState<string>('MIXED_STORE');
  const [eventCount, setEventCount] = useState<number>(25);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [report, setReport] = useState<BatchReport | null>(null);

  if (!isOpen) return null;

  const handleStart = async () => {
    setIsRunning(true);
    setReport(null);
    try {
      const result = await onRunBatch(scenarioType, eventCount);
      setReport(result);
    } catch (e) {
      console.error("Batch simulation failed", e);
    } finally {
      setIsRunning(false);
    }
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Batch Simulation & Recovery Lab</h2>
              <p className="text-xs text-slate-400">Generate multi-case transaction streams and calculate aggregate ROI</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form & Setup */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Scenario Type</label>
              <select
                value={scenarioType}
                onChange={(e) => setScenarioType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="MIXED_STORE">Mixed E-Commerce & SaaS Store (Balanced)</option>
                <option value="HIGH_VALUE_B2B">High-Value B2B Receivables Focus</option>
                <option value="CHECKOUT_DROP">High-Volume Cart Abandonment Surge</option>
                <option value="SUBSCRIPTION_CHURN">Subscription Payment Failure Churn</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Event Batch Count</label>
              <select
                value={eventCount}
                onChange={(e) => setEventCount(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
              >
                <option value={15}>15 Events Batch</option>
                <option value={25}>25 Events Batch</option>
                <option value={50}>50 Events Batch</option>
                <option value={100}>100 Events Batch</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={isRunning}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-900/30 transition flex items-center justify-center gap-2"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Running Real-Time Batch Event Loop...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Batch Simulation</span>
              </>
            )}
          </button>

          {/* Results Report Card */}
          {report && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Batch Recovery Report</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {report.recovery_rate_percent}% Recovery Yield
                </span>
              </div>

              {/* Core Financial Numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Revenue at Risk</span>
                  <div className="text-base font-black text-amber-400 mt-1">{formatINR(report.total_revenue_at_risk)}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Est. Recoverable</span>
                  <div className="text-base font-black text-blue-400 mt-1">{formatINR(report.estimated_recoverable_revenue)}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Successfully Recovered</span>
                  <div className="text-base font-black text-emerald-400 mt-1">{formatINR(report.total_revenue_recovered)}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">ROI Multiple</span>
                  <div className="text-base font-black text-cyan-400 mt-1">{report.roi_multiple}x</div>
                </div>
              </div>

              {/* Workflow Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300">Recovery Breakdown by Risk Type</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(report.recovery_by_type || {}).map(([type, amt]) => (
                    <div key={type} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                      <span className="text-slate-400">{type.replace('_', ' ')}</span>
                      <span className="font-bold text-emerald-400">{formatINR(amt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-900">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700">
            Close Lab
          </button>
        </div>
      </div>
    </div>
  );
};
