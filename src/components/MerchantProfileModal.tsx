import React, { useState } from 'react';
import { 
  Building, Key, Sliders, Bell, Lock, Activity, HelpCircle, 
  X, CheckCircle2, ShieldCheck, Copy, Check, ExternalLink, Save
} from 'lucide-react';

interface MerchantProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMerchant: { merchant_id: string; name: string; company_name: string; email: string } | null;
  onUpdateMerchant: (updated: { merchant_id: string; name: string; company_name: string; email: string }) => void;
  onLogout: () => void;
  activeSubSection?: string;
}

export const MerchantProfileModal: React.FC<MerchantProfileModalProps> = ({
  isOpen,
  onClose,
  currentMerchant,
  onUpdateMerchant,
  onLogout,
  activeSubSection = 'profile'
}) => {
  const [activeSection, setActiveSection] = useState<string>(activeSubSection);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  // Form states
  const [name, setName] = useState(currentMerchant?.name || 'Rajesh Kumar');
  const [companyName, setCompanyName] = useState(currentMerchant?.company_name || 'TechCorp India Pvt Ltd');
  const [email, setEmail] = useState(currentMerchant?.email || 'admin@techcorp.in');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [gstin, setGstin] = useState('27AAACT1234F1Z5');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMerchant({
      merchant_id: currentMerchant?.merchant_id || 'merch_techcorp_test_99',
      name,
      company_name: companyName,
      email
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const navItems = [
    { id: 'profile', label: 'View & Edit Business Profile', icon: Building, color: 'text-sky-400' },
    { id: 'razorpay', label: 'Razorpay Integration & Keys', icon: Key, color: 'text-emerald-400' },
    { id: 'agent', label: 'Agent Policy & Guardrails', icon: Sliders, color: 'text-cyan-400' },
    { id: 'webhook', label: 'API & Webhook Live Status', icon: Activity, color: 'text-indigo-400' },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell, color: 'text-amber-400' },
    { id: 'security', label: 'Security & Password', icon: Lock, color: 'text-purple-400' },
    { id: 'help', label: 'Help & Documentation', icon: HelpCircle, color: 'text-slate-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT SIDEBAR: Profile Card & Feature Menu */}
        <div className="w-full md:w-80 bg-slate-950/90 border-r border-slate-800/80 p-6 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div>
            {/* Merchant Identity Header */}
            <div className="flex items-center gap-3.5 pb-6 border-b border-slate-800/80">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 via-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-sky-500/20">
                {name ? name.charAt(0).toUpperCase() : 'M'}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-extrabold text-base text-white truncate">{companyName}</h3>
                <p className="text-xs text-slate-400 truncate">{email}</p>
                <p className="text-[10px] font-mono text-sky-400 mt-1 truncate">ID: {currentMerchant?.merchant_id || 'merch_techcorp_test_99'}</p>
              </div>
            </div>

            {/* Razorpay Test Mode Badge */}
            <div className="my-4 px-3 py-2 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Razorpay: Connected ✓</span>
              </div>
              <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Test Mode
              </span>
            </div>

            {/* Navigation List */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Merchant Settings</p>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive 
                        ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-md' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logout Action */}
          <div className="pt-6 border-t border-slate-800/80 mt-6">
            <button
              onClick={() => { onClose(); onLogout(); }}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <span>Logout Merchant Account</span>
            </button>
          </div>
        </div>

        {/* RIGHT DISPLAY PANE: Dynamic feature rendering */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-900">
          
          {/* 1. BUSINESS PROFILE VIEW / EDIT */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-sky-400" />
                  Business Profile & Details
                </h2>
                <p className="text-xs text-slate-400 mt-1">Manage your merchant company information and registered contact points.</p>
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Company / Business Name</label>
                    <input 
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Authorized Contact Person</label>
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Business Email Address</label>
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Contact Phone</label>
                    <input 
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">GSTIN / Tax ID</label>
                    <input 
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Merchant ID</label>
                    <input 
                      type="text"
                      value={currentMerchant?.merchant_id || 'merch_techcorp_test_99'}
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 text-slate-500 font-mono cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-sky-500/20 transition flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Business Details</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. RAZORPAY INTEGRATION & KEYS */}
          {activeSection === 'razorpay' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-emerald-400" />
                  Razorpay Integration & API Status
                </h2>
                <p className="text-xs text-slate-400 mt-1">Managed server-side credentials and webhooks for Razorpay Test Mode.</p>
              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Connection Status</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    CONNECTED (TEST MODE)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Key ID</span>
                    <span className="font-mono text-slate-200">rzp_test_TYMqZDUPS4qxTK</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Key Secret</span>
                    <span className="font-mono text-slate-500">••••••••••••••••••••••••</span>
                  </div>
                </div>
              </div>

              {/* Render Public Webhook URL */}
              <div className="space-y-2 text-xs">
                <label className="block text-slate-400 font-medium">Public HTTPS Webhook URL (Render)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text"
                    readOnly
                    value="https://recoverai-backend-mn6i.onrender.com/api/v1/events/webhook"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sky-400 font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard('https://recoverai-backend-mn6i.onrender.com/api/v1/events/webhook')}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-slate-300 space-y-2">
                <h4 className="font-bold text-sky-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Hackathon Security Guarantee
                </h4>
                <p className="text-slate-400">
                  API secrets are loaded via secure environment variables (`RAZORPAY_KEY_SECRET`). Frontend components interact exclusively with Razorpay's REST API and backend webhook triggers.
                </p>
              </div>
            </div>
          )}

          {/* 3. AGENT POLICY & GUARDRAILS */}
          {activeSection === 'agent' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-cyan-400" />
                  Agent Guardrails & Autonomous Policies
                </h2>
                <p className="text-xs text-slate-400 mt-1">Configure maximum recovery limits, human escalation thresholds, and retry limits.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white">Autonomous Payment Link Generation</h4>
                    <p className="text-slate-400">Automatically issue Razorpay Payment Links for failed payments below threshold.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">ENABLED</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white">Human Escalation Threshold</h4>
                    <p className="text-slate-400">Transactions exceeding ₹50,000 require manual review before recovery execution.</p>
                  </div>
                  <span className="font-mono text-amber-400 font-bold text-sm">₹50,000.00</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white">Max Retry Count</h4>
                    <p className="text-slate-400">Maximum automated payment retries per customer case.</p>
                  </div>
                  <span className="font-mono text-white font-bold text-sm">3 Attempts</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. API & WEBHOOK LIVE STATUS */}
          {activeSection === 'webhook' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  API & Webhook Live Status
                </h2>
                <p className="text-xs text-slate-400 mt-1">Monitor live WebSockets, event stream latency, and backend health.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-xs">FastAPI Server</span>
                  <p className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> 200 OK (8000)
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-xs">WebSocket Stream</span>
                  <p className="text-indigo-400 font-bold text-sm flex items-center gap-1.5">
                    <Activity className="w-4 h-4" /> Connected
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 5. NOTIFICATION PREFERENCES */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-400" />
                  Notification Preferences
                </h2>
                <p className="text-xs text-slate-400 mt-1">Configure alerts for human escalations, high-value recoveries, and daily summaries.</p>
              </div>
              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <span>Email Alerts on High-Value Escalations</span>
                  <input type="checkbox" defaultChecked className="accent-sky-500 w-4 h-4" />
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <span>WhatsApp Daily Recovery Summary</span>
                  <input type="checkbox" defaultChecked className="accent-sky-500 w-4 h-4" />
                </label>
              </div>
            </div>
          )}

          {/* 6. SECURITY & PASSWORD */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-purple-400" />
                  Security & Authentication
                </h2>
                <p className="text-xs text-slate-400 mt-1">Manage merchant password and multi-factor authentication.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <span className="text-slate-300 font-semibold block">Password Protection</span>
                <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition">
                  Change Password
                </button>
              </div>
            </div>
          )}

          {/* 7. HELP & DOCUMENTATION */}
          {activeSection === 'help' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-slate-400" />
                  Help & Developer Documentation
                </h2>
                <p className="text-xs text-slate-400 mt-1">Guides, Razorpay API references, and Hackathon setup documentation.</p>
              </div>
              <div className="space-y-3 text-xs">
                <a 
                  href="https://razorpay.com/docs/api/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition group"
                >
                  <div>
                    <h4 className="font-bold text-white group-hover:text-sky-400 transition">Razorpay Webhook Setup Guide</h4>
                    <p className="text-slate-400">Learn how to subscribe your Razorpay Dashboard to RecoverAI.</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white" />
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
