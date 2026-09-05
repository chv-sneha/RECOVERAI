import React, { useEffect, useState } from 'react';
import { ShieldCheck, Play, Zap, AlertTriangle, FileText, Settings, Layers, BarChart2, User, LogOut } from 'lucide-react';

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
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'cases', label: 'Recovery Cases', icon: Layers },
    { id: 'control', label: 'Control Center', icon: Settings },
    { id: 'escalations', label: 'Escalations', icon: AlertTriangle, badge: activeEscalationCount },
    { id: 'audit', label: 'Audit Trail', icon: FileText },
    { id: 'batch', label: 'Batch Lab', icon: Zap },
  ];

  const isRazorpayConnected = merchantStatus?.connected;

  return (
    <header className="sticky top-0 z-50 bg-[#030712]/95 border-b border-slate-800/80 backdrop-blur-xl py-3 px-4 sm:px-8 shadow-2xl font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Far Left Brand Logo (Matching Mandamus Screenshot) */}
        <div 
          onClick={onOpenLogin}
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition group flex-shrink-0"
          title="Click to Exit & Return to Intro Page"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-400 via-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl text-white tracking-widest uppercase">RECOVERAI</span>
        </div>

        {/* Center Floating Capsule Nav (Matching Mandamus Screenshot) */}
        <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl shadow-2xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-400 via-cyan-500 to-blue-600 text-white shadow-md shadow-sky-500/25 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Far Right Action Buttons */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Status Badge */}
          <div className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-medium ${
            isRazorpayConnected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <span className={`h-2 w-2 rounded-full ${
              isRazorpayConnected ? 'bg-emerald-400 animate-pulse' : (wsConnected ? 'bg-cyan-400 animate-pulse' : 'bg-amber-400')
            }`} />
            <span>{isRazorpayConnected ? 'Razorpay Test Connected' : 'Sandbox Active'}</span>
          </div>

          {/* Quick Demo Trigger */}
          <button
            onClick={onTriggerSingleDemo}
            className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition flex items-center gap-1.5 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Simulate Failure</span>
          </button>

          {/* Logout & Profile Button */}
          <button
            onClick={onOpenLogin}
            className="px-4 py-1.5 rounded-full bg-slate-900 hover:bg-rose-950/50 border border-slate-800 hover:border-rose-500/40 text-slate-200 hover:text-rose-300 text-xs font-bold transition flex items-center gap-1.5"
            title="Logout & Exit to Intro Page"
          >
            <User className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">{currentMerchant?.company_name ? currentMerchant.company_name.split(' ')[0] : 'Logout'}</span>
            <LogOut className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
