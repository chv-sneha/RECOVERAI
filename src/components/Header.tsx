import React, { useEffect, useState } from 'react';
import { ShieldCheck, Play, Zap, AlertTriangle, FileText, Settings, Layers, BarChart2, User } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onTriggerSingleDemo: () => void;
  onOpenBatchSim: () => void;
  wsConnected: boolean;
  activeEscalationCount: number;
  currentMerchant: { merchant_id: string; name: string; company_name: string; email: string } | null;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onTriggerSingleDemo,
  onOpenBatchSim,
  wsConnected,
  activeEscalationCount,
  currentMerchant,
  onOpenLogin
}) => {
  const [merchantStatus, setMerchantStatus] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/merchant/status")
      .then(res => res.json())
      .then(data => setMerchantStatus(data))
      .catch(() => setMerchantStatus({ connected: false, mode: 'SIMULATION_MODE' }));
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Financial Dashboard', icon: BarChart2 },
    { id: 'cases', label: 'Recovery Cases', icon: Layers },
    { id: 'control', label: 'Agent Control Center', icon: Settings },
    { id: 'escalations', label: 'Human Escalation Queue', icon: AlertTriangle, badge: activeEscalationCount },
    { id: 'audit', label: 'Audit Trail', icon: FileText },
    { id: 'batch', label: 'Batch Simulation Lab', icon: Zap },
  ];

  const isRazorpayConnected = merchantStatus?.connected;

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">RecoverAI</h1>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Razorpay Track 03
              </span>
            </div>
            <p className="text-xs text-slate-400">Real-Time Autonomous Revenue Recovery Agent</p>
          </div>
        </div>

        {/* Real-time Status & Demo Triggers */}
        <div className="flex items-center gap-3">
          {/* Active Merchant Badge / Sign In Trigger */}
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs transition"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <div className="text-left">
              <div className="text-white font-bold leading-none text-[11px]">
                {currentMerchant ? currentMerchant.company_name : "Sign In Merchant"}
              </div>
              <div className="text-[10px] text-slate-400 leading-none mt-0.5 font-mono">
                {currentMerchant ? currentMerchant.merchant_id : "Click to Login"}
              </div>
            </div>
          </button>

          {/* Dynamic Razorpay Connection Status Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${
            isRazorpayConnected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-slate-800/80 border-slate-700/60 text-slate-300'
          }`}>
            <span className={`h-2.5 w-2.5 rounded-full ${
              isRazorpayConnected 
                ? 'bg-emerald-400 animate-pulse' 
                : (wsConnected ? 'bg-cyan-400 animate-pulse' : 'bg-amber-400')
            }`} />
            <span className="font-semibold">
              {isRazorpayConnected
                ? 'Razorpay Connected ✓ (Test Mode)'
                : (wsConnected ? 'Agent Live (WebSocket Active)' : 'Simulation Mode')}
            </span>
          </div>

          {/* Quick Single Demo Action */}
          <button
            onClick={onTriggerSingleDemo}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium text-xs hover:from-emerald-500 hover:to-teal-500 transition shadow-md shadow-emerald-900/30 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Single ₹4,999 Failure</span>
          </button>

          {/* Start Batch Simulation Button */}
          <button
            onClick={onOpenBatchSim}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-xs hover:from-blue-500 hover:to-indigo-500 transition shadow-md shadow-indigo-900/30 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Batch Simulation</span>
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto no-scrollbar border-t border-slate-800/60">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
