import React, { useState } from 'react';
import { 
  ShieldCheck, User, Building, Mail, Zap, Lock, Activity, Bot, ChevronRight
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
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white relative overflow-hidden font-sans">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-0" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} 
      />

      {/* Original Cyan / Blue Ambient Light Glows */}
      <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Header with Centered Capsule Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 py-5 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl text-white tracking-widest uppercase">RECOVERAI</span>
          </div>

          {/* Floating Pill Center Navigation */}
          <nav className="hidden md:flex items-center gap-8 px-7 py-2.5 rounded-full bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-2xl">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xs font-semibold text-slate-200 hover:text-cyan-400 transition"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-xs font-semibold text-slate-400 hover:text-cyan-400 transition"
            >
              How it works
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-xs font-semibold text-slate-400 hover:text-cyan-400 transition"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-xs font-semibold text-slate-400 hover:text-cyan-400 transition"
            >
              About
            </button>
          </nav>

          {/* Top-Right Sign In Pill Button */}
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition active:scale-95"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="relative pt-44 pb-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center z-10">
        {/* Outlined Capsule Top Badge */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[11px] font-bold tracking-widest uppercase mb-8">
          RAZORPAY AI REVENUE PLATFORM
        </div>

        {/* Hero Headline */}
        <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-[1.08] mb-6">
          Revenue Lost <br className="hidden sm:inline" />
          Is Revenue Denied.
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          RecoverAI gives merchants the tools to change that — today.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleQuickDemoLogin}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs tracking-wide shadow-xl shadow-cyan-500/30 transition active:scale-95 flex items-center justify-center gap-2"
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
      </section>

      {/* Floating Bottom-Right Assistant Widget (Matching image layout) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <div className="hidden sm:block max-w-xs bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase">AI Agent Active</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Click <strong>Explore the Platform</strong> for 1-click merchant demo access.
          </p>
        </div>
        <button
          onClick={handleQuickDemoLogin}
          className="h-12 w-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-xl shadow-cyan-500/30 hover:scale-105 transition active:scale-95"
          title="Launch Demo"
        >
          <Bot className="w-6 h-6" />
        </button>
      </div>

      {/* Section: How It Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[11px] font-extrabold text-cyan-400 tracking-widest uppercase">AUTOMATED RECOVERY ENGINE</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">How RecoverAI Operates</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A closed-loop AI agent pipeline that intercepts payment failures directly via Razorpay Webhooks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-cyan-500/50 transition">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs mb-4 border border-cyan-500/20">
              01
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Signal Interception</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Razorpay HMAC Webhooks emit instant transaction failure payloads (`payment.failed`, `order.paid`).
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-blue-500/50 transition">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs mb-4 border border-blue-500/20">
              02
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Root-Cause Diagnosis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              LLM diagnoses exact decline causes (card limit exceeded, bank downtime, auth timeout).
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-indigo-500/50 transition">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs mb-4 border border-indigo-500/20">
              03
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Policy Guardrails</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Policy Engine verifies strict merchant limits (Max ₹50,000 cap, max 3 retries, cooldown hours).
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-emerald-500/50 transition">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs mb-4 border border-emerald-500/20">
              04
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Smart Action & Ledger</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates official Razorpay Smart Payment Link (`plink_...`) and appends an immutable audit record.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Features */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[11px] font-extrabold text-cyan-400 tracking-widest uppercase">PLATFORM CAPABILITIES</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Built for Razorpay Merchants</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Enterprise-grade safety, closed-loop execution, and real-time dashboard analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Razorpay Smart Links</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Direct REST API integration with Razorpay (`POST /v1/payment_links`) to generate 1-click retry links.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Merchant Policy Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strict merchant parameters. High-value attempts automatically redirect to Human Operations Queue.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Immutable Audit Trail</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every agent decision and execution payload is logged with timestamped verification for compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Section: About */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-900 text-center relative z-10">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 space-y-6 shadow-2xl">
          <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold">
            Razorpay Hackathon Track 03
          </span>
          <h2 className="text-3xl font-black text-white">Autonomous Revenue Recovery</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            RecoverAI bridges the gap between transaction declines and merchant wallet settlement using closed-loop autonomous AI agents.
          </p>
          <div className="pt-2 flex items-center justify-center gap-4">
            <button
              onClick={handleQuickDemoLogin}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs tracking-wider shadow-lg transition active:scale-95"
            >
              Enter Merchant Portal Now
            </button>
          </div>
        </div>
      </section>

      {/* Sign In Drawer / Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl space-y-6">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-sm"
            >
              ✕
            </button>

            <div className="text-center space-y-2">
              <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Merchant Portal Sign In</h3>
              <p className="text-xs text-slate-400">Enter your merchant details to access your dashboard</p>
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow-md shadow-cyan-900/30"
              >
                {isLoading ? "Authenticating..." : "Sign In to Merchant Portal"}
              </button>

              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <span>⚡ 1-Click Demo Login (TechCorp)</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center text-xs text-slate-500 z-10 relative">
        <p>RECOVERAI — Razorpay AI Revenue Recovery Challenge | Track 03</p>
      </footer>
    </div>
  );
};
