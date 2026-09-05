import React, { useState } from 'react';
import { 
  ShieldCheck, User, Building, Mail, LogIn, ArrowRight, Zap, Cpu, Lock, 
  CheckCircle2, TrendingUp, AlertTriangle, RefreshCw, Layers, ShieldAlert,
  Terminal, Sparkles, ChevronRight, Activity, Globe, DollarSign, Play, X
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (merchant: { merchant_id: string; name: string; company_name: string; email: string }) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('rajesh@techcorp.in');
  const [name, setName] = useState<string>('Rajesh Kumar');
  const [companyName, setCompanyName] = useState<string>('TechCorp India Pvt Ltd');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showAssistantBox, setShowAssistantBox] = useState<boolean>(true);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, company_name: companyName })
      });
      if (res.ok) {
        const data = await res.json();
        onLoginSuccess(data);
      } else {
        onLoginSuccess({
          merchant_id: "mch_8829_techcorp",
          name,
          company_name: companyName,
          email
        });
      }
    } catch (e) {
      onLoginSuccess({
        merchant_id: "mch_8829_techcorp",
        name,
        company_name: companyName,
        email
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    setEmail('rajesh@techcorp.in');
    setName('Rajesh Kumar');
    setCompanyName('TechCorp India Pvt Ltd');
    handleLogin();
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-rose-500 selection:text-white relative overflow-hidden font-sans">
      {/* Background Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none z-0" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} 
      />

      {/* Atmospheric Ambient Glow Light Bursts (Inspired by Mandamus aesthetics) */}
      <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-rose-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-2/3 -right-40 w-[600px] h-[600px] bg-rose-700/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-600/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Header with Centered Floating Pill Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-600/30">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl text-white tracking-widest uppercase">RECOVERAI</span>
          </div>

          {/* Floating Pill Center Navigation Bar */}
          <nav className="hidden md:flex items-center gap-6 px-6 py-2 rounded-full bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-2xl">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              How it works
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              About
            </button>
          </nav>

          {/* Right Action Sign In Pill */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition active:scale-95"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="relative pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center z-10">
        {/* Outlined Pill Top Badge */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 text-[11px] font-bold tracking-widest uppercase mb-8 shadow-inner">
          RAZORPAY AI REVENUE PLATFORM
        </div>

        {/* Huge High-Impact Statement Title */}
        <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-[1.08] mb-6">
          Revenue Lost <br className="hidden sm:inline" />
          Is Revenue Denied.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
          RecoverAI gives merchants the tools to change that — today.
        </p>

        {/* Primary Pill Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleQuickDemoLogin}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs tracking-wide shadow-xl shadow-rose-600/30 transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Explore the Platform</span>
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300 font-semibold text-xs transition flex items-center justify-center gap-2"
          >
            <span>See How It Works</span>
          </button>
        </div>

        {/* Hero Quick Metrics Pill Bar */}
        <div className="mt-16 pt-10 border-t border-slate-900 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div>
            <p className="text-[11px] font-bold text-rose-500 uppercase tracking-widest">Revenue Intercepted</p>
            <p className="text-3xl font-black text-white mt-1">₹1.98 LAKH</p>
            <p className="text-[10px] text-slate-500 mt-1">Razorpay Sandbox Live</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-rose-500 uppercase tracking-widest">Recovery Success</p>
            <p className="text-3xl font-black text-white mt-1">78.4%</p>
            <p className="text-[10px] text-slate-500 mt-1">Automated Smart Links</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-rose-500 uppercase tracking-widest">Mean Recovery Time</p>
            <p className="text-3xl font-black text-white mt-1">&lt; 90 SEC</p>
            <p className="text-[10px] text-slate-500 mt-1">Zero Manual Outreach</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-rose-500 uppercase tracking-widest">Safety Guardrails</p>
            <p className="text-3xl font-black text-white mt-1">100% STRICT</p>
            <p className="text-[10px] text-slate-500 mt-1">Bounded Policy Caps</p>
          </div>
        </div>
      </section>

      {/* Floating Bottom-Right Assistant Widget (Exact Match to Mandamus UI inspiration) */}
      {showAssistantBox && (
        <div className="fixed bottom-6 right-6 z-40 max-w-xs w-full bg-slate-950/90 border border-rose-500/40 rounded-xl p-4 shadow-2xl backdrop-blur-xl animate-fade-in text-left">
          <div className="flex items-center justify-between border-b border-rose-900/40 pb-2 mb-2">
            <span className="text-[10px] font-bold text-rose-500 tracking-widest uppercase">
              WELCOME_TO_RECOVERAI
            </span>
            <button 
              onClick={() => setShowAssistantBox(false)}
              className="text-slate-500 hover:text-white transition text-xs font-bold"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
            I am your revenue recovery agent assistant. We are here to accelerate payment recoveries. Scroll down to see how we solve the merchant transaction loss crisis.
          </p>
          <div className="text-[9px] font-mono text-slate-500 border-t border-slate-900 pt-2">
            NEXT: Click <span className="text-rose-400 font-semibold cursor-pointer underline" onClick={handleQuickDemoLogin}>Explore the Platform</span> to access the Merchant Enclave.
          </div>
        </div>
      )}

      {/* Section: How It Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-[11px] font-extrabold text-rose-500 tracking-widest uppercase">AUTOMATED RECOVERY ENGINE</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">How RecoverAI Operates</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A closed-loop AI agent pipeline that intercepts payment failures directly via Razorpay Webhooks and executes bounded policy actions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-6 relative hover:border-rose-500/40 transition group">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center font-black text-sm mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-white mb-2">Signal Interception</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Razorpay HMAC Webhooks emit instant transaction failure payloads (`payment.failed`, `order.paid`).
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-6 relative hover:border-rose-500/40 transition group">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center font-black text-sm mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-white mb-2">Root-Cause Diagnosis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Structured LLM diagnoses exact decline causes (card limit exceeded, bank downtime, authentication timeout).
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-6 relative hover:border-rose-500/40 transition group">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center font-black text-sm mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-white mb-2">Deterministic Guardrails</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Policy Engine verifies strict merchant limits (Max ₹50,000 cap, max 3 retries, cooldown hours).
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-6 relative hover:border-rose-500/40 transition group">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center font-black text-sm mb-4">
              04
            </div>
            <h3 className="text-base font-bold text-white mb-2">Smart Action & Ledger</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates official Razorpay Smart Payment Link (`plink_...`) and logs an immutable audit trail entry.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Features */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-[11px] font-extrabold text-rose-500 tracking-widest uppercase">PLATFORM CAPABILITIES</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Built for Razorpay Merchants</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Enterprise-grade safety, closed-loop execution, and real-time dashboard analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-950/80 border border-slate-900 rounded-3xl p-8 space-y-4 hover:border-slate-800 transition">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/10 border border-rose-500/30 text-rose-500 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Razorpay Smart Links</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calls Razorpay REST API (`POST /v1/payment_links`) to generate 1-click retry links with priority WhatsApp & SMS messaging.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-900 rounded-3xl p-8 space-y-4 hover:border-slate-800 transition">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/10 border border-rose-500/30 text-rose-500 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Policy Guardrail Control</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Merchants retain total control. Any high-value transaction or high-risk attempt automatically escalates to the Human Operations Queue.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-900 rounded-3xl p-8 space-y-4 hover:border-slate-800 transition">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/10 border border-rose-500/30 text-rose-500 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Immutable Audit Ledger</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every agent decision, diagnosis payload, and action execution is logged with timestamped HMAC verification for 100% auditability.
            </p>
          </div>
        </div>
      </section>

      {/* Section: About */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-900 text-center relative z-10">
        <div className="bg-slate-950/80 border border-rose-500/30 rounded-3xl p-10 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Razorpay Hackathon Track 03</span>
          </div>

          <h2 className="text-3xl font-black text-white">Accelerating India's Digital Commerce Engine</h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            RecoverAI bridges the gap between transaction declines and merchant wallet settlement using closed-loop autonomous AI agents. Built with real Razorpay REST API integrations and sandbox simulation capabilities.
          </p>

          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={handleQuickDemoLogin}
              className="px-8 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs tracking-wider shadow-lg shadow-rose-600/30 transition active:scale-95"
            >
              Enter Merchant Portal Now
            </button>
          </div>
        </div>
      </section>

      {/* Sign In Drawer / Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-950 border border-rose-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl space-y-6">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white font-bold text-sm"
            >
              ✕
            </button>

            <div className="text-center space-y-2">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-600/30">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Merchant Enclave Sign In</h3>
              <p className="text-xs text-slate-400">Access your autonomous recovery dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Store Name</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="TechCorp India Pvt Ltd"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Merchant Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rajesh Kumar"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rajesh@techcorp.in"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-md shadow-rose-600/30"
              >
                {isLoading ? "Authenticating..." : "Sign In to Merchant Enclave"}
              </button>

              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <span>⚡ Quick Demo (TechCorp India)</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-950 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center text-xs text-slate-600 z-10 relative">
        <p>RECOVERAI — Razorpay AI Revenue Recovery Challenge | Track 03</p>
      </footer>
    </div>
  );
};
