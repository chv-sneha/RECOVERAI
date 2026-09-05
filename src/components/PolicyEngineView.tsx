import React, { useState } from 'react';
import { ShieldCheck, Sliders, Lock, CheckCircle2, Save } from 'lucide-react';
import type { PolicyConfig } from '../types';

interface PolicyEngineViewProps {
  policy: PolicyConfig;
  onUpdatePolicy: (newPolicy: PolicyConfig) => void;
}

export const PolicyEngineView: React.FC<PolicyEngineViewProps> = ({ policy, onUpdatePolicy }) => {
  const [formData, setFormData] = useState<PolicyConfig>(policy);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePolicy(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Agent Control Center & Policy Engine</h2>
            <p className="text-xs text-slate-400">
              Deterministic backend policy guardrails. LLMs can never bypass these bounds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Backend Enforcement ACTIVE</span>
        </div>
      </div>

      {/* Policy Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Retry & Velocity Limits */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Retry & Velocity Safeguards</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Maximum Autonomous Retries
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={formData.max_retries}
              onChange={(e) => setFormData({ ...formData, max_retries: parseInt(e.target.value) || 1 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Hard limit on automated payment retry attempts per case.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Maximum Automated Customer Reminders
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={formData.max_reminders}
              onChange={(e) => setFormData({ ...formData, max_reminders: parseInt(e.target.value) || 1 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Prevents spamming customers over SMS / WhatsApp channels.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Minimum Cooldown Window (Hours)
            </label>
            <input
              type="number"
              step="0.5"
              min={1}
              max={48}
              value={formData.cooldown_hours}
              onChange={(e) => setFormData({ ...formData, cooldown_hours: parseFloat(e.target.value) || 1.0 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Mandatory quiet period between automated recovery actions.
            </span>
          </div>
        </div>

        {/* Monetary Cap & Escalation Thresholds */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Monetary Cap & Escalation Bounds</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Maximum Autonomous Recovery Cap (INR ₹)
            </label>
            <input
              type="number"
              step="5000"
              min={5000}
              max={500000}
              value={formData.max_autonomous_cap}
              onChange={(e) => setFormData({ ...formData, max_autonomous_cap: parseFloat(e.target.value) || 50000 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Cases above ₹{formData.max_autonomous_cap.toLocaleString()} are automatically gated to Human Escalation Queue.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Human Escalation Threshold (INR ₹)
            </label>
            <input
              type="number"
              step="5000"
              min={5000}
              max={500000}
              value={formData.escalation_threshold}
              onChange={(e) => setFormData({ ...formData, escalation_threshold: parseFloat(e.target.value) || 50000 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Triggers priority notification to merchant finance team.
            </span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-900/30 transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savedSuccess ? "Policy Saved & Applied!" : "Save Policy Configuration"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
