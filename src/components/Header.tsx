import React from 'react';
import { ShieldCheck, Play, Zap, AlertTriangle, FileText, Settings, Layers, BarChart2, User, LogOut } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onTriggerSingleDemo: () => void;
  onOpenBatchSim?: () => void;
  wsConnected: boolean;
  activeEscalationCount: number;
  currentMerchant: { merchant_id: string; name: string; company_name: string; email: string } | null;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onTriggerSingleDemo,
  activeEscalationCount,
  currentMerchant,
  onOpenLogin
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'cases', label: 'Recovery Cases', icon: Layers },
    { id: 'control', label: 'Control Center', icon: Settings },
    { id: 'escalations', label: 'Escalations', icon: AlertTriangle, badge: activeEscalationCount },
    { id: 'audit', label: 'Audit Trail', icon: FileText },
    { id: 'batch', label: 'Batch Lab', icon: Zap },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#030712]/95 border-b border-slate-800/80 backdrop-blur-xl py-3.5 px-6 sm:px-12 shadow-2xl font-sans w-full">
      <div className="w-full flex items-center justify-between">
        {/* Far Left End: Brand Icon & Name */}
        <div 
          onClick={onOpenLogin}
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition group flex-shrink-0"
          title="Click to Exit & Return to Intro Page"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-400 via-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-2xl text-white tracking-widest uppercase">RECOVERAI</span>
        </div>

        {/* Center Floating Capsule Nav Bar with Proper Spacing */}
        <nav className="hidden md:flex items-center gap-4 px-6 py-2 rounded-full bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl shadow-2xl mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
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

        {/* Far Right End: Action Buttons & Profile Icon */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Quick Demo Trigger */}
          <button
            onClick={onTriggerSingleDemo}
            className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition flex items-center gap-1.5 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Failure</span>
          </button>

          {/* Far Right End Profile Icon / Logout Button */}
          <button
            onClick={onOpenLogin}
            className="px-4 py-2 rounded-full bg-slate-900 hover:bg-rose-950/50 border border-slate-800 hover:border-rose-500/40 text-slate-200 hover:text-rose-300 text-xs font-bold transition flex items-center gap-2"
            title="Logout & Exit to Intro Page"
          >
            <User className="w-4 h-4 text-sky-400" />
            <span>{currentMerchant?.company_name ? currentMerchant.company_name.split(' ')[0] : 'Merchant'}</span>
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
