import React, { useState } from 'react';
import { 
  ShieldCheck, User, Building, Mail, LogIn, ArrowRight, Zap, Cpu, Lock, 
  CheckCircle2, TrendingUp, AlertTriangle, RefreshCw, Layers, ShieldAlert,
  Terminal, Sparkles, ChevronRight, Activity, Globe, DollarSign
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white relative overflow-hidden font-sans">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-2/3 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white tracking-tight">RecoverAI</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
                  Razorpay Track 03
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Autonomous Revenue Recovery Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
            >
              Merchant Sign In
            </button>
            <button
              onClick={handleQuickDemoLogin}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center gap-1.5 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>1-Click Hackathon Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-medium text-slate-300">
              Built for <strong className="text-white font-semibold">Razorpay AI Revenue Recovery Challenge</strong>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Autonomous AI Agent to Intercept & Recover{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Failed Razorpay Transactions
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Turn transaction failures, checkout drop-offs, and overdue invoice losses into recovered revenue. 
            Powered by bounded LLM diagnosis, Razorpay Smart Payment Links, and strict merchant policy guardrails.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleQuickDemoLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold text-sm shadow-2xl shadow-emerald-900/40 transition flex items-center justify-center gap-2.5 group active:scale-95"
            >
              <LogIn className="w-5 h-5" />
              <span>Launch Live Portal (TechCorp Demo)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>Merchant Sign In</span>
            </button>
          </div>

          {/* Hero Metrics Strip */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Revenue Recovered</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">₹1,98,400</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Real-time settlement</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Intervention Success</p>
              <p className="text-2xl font-black text-cyan-400 mt-1">78.4%</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Smart Payment Links</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Mean Time to Recover</p>
              <p className="text-2xl font-black text-indigo-400 mt-1">&lt; 90 sec</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Automated outreach</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Safety Policy Check</p>
              <p className="text-2xl font-black text-purple-400 mt-1">100% Deterministic</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Bounded risk guardrails</p>
            </div>
          </div>
        </div>
      </section>

      {/* Closed Loop Architecture Pipeline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center space-y-3 mb-12">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
            Closed-Loop Agent Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            How RecoverAI Automates Revenue Recovery
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            From Razorpay webhook signal to real-time wallet settlement — complete agent loop with zero human effort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative hover:border-cyan-500/50 transition">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs mb-3 border border-cyan-500/20">
              01
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Detect</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Subscribes to Razorpay REST Webhooks (`payment.failed`, `order.paid`).
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative hover:border-blue-500/50 transition">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs mb-3 border border-blue-500/20">
              02
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Diagnose</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              LLM analyzes decline codes (e.g. `BAD_REQUEST_PAYMENT_TIMED_OUT`, card limits).
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative hover:border-purple-500/50 transition">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs mb-3 border border-purple-500/20">
              03
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Policy Check</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Verifies merchant guardrails: Max ₹50k limit, 3 retries max, cooldown timers.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative hover:border-emerald-500/50 transition">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs mb-3 border border-emerald-500/20">
              04
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Smart Action</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Generates Razorpay Smart Link (`plink_...`) with priority SMS/WhatsApp dispatch.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative hover:border-amber-500/50 transition">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs mb-3 border border-amber-500/20">
              05
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Audit Ledger</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Appends immutable HMAC signature record to audit trail for complete compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Razorpay Integration Technical Capabilities */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Razorpay Smart Links</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Direct API integration with Razorpay REST endpoints (`POST /v1/payment_links`) allowing customers to easily complete payment via UPI, Cards, or Netbanking.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Merchant Policy Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strict merchant-configured boundary parameters. High value payments (&gt; ₹50,000) or high risk flags automatically redirect to Human Escalation Queue.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Live & Simulation Modes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Test end-to-end recovery using real Razorpay Key Secret credentials or trigger built-in batch failure scenario lab right inside the app.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Launch CTA Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl shadow-cyan-950/50">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Ready to see RecoverAI in Action?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Access the merchant portal immediately with TechCorp India test data or log in with your custom merchant credentials.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button
              onClick={handleQuickDemoLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-wider shadow-xl transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>⚡ Enter Merchant Portal (1-Click Demo)</span>
            </button>
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-950 border border-slate-700 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider transition"
            >
              Sign In with Custom Merchant Account
            </button>
          </div>
        </div>
      </section>

      {/* Modal for Custom Merchant Sign In */}
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
              <h3 className="text-lg font-bold text-white">Merchant Portal Login</h3>
              <p className="text-xs text-slate-400">Enter your merchant credentials to access your recovery dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
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
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow-md shadow-cyan-900/30"
              >
                {isLoading ? "Authenticating..." : "Sign In to Merchant Portal"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center text-xs text-slate-500">
        <p>RecoverAI — Real-Time Autonomous Revenue Recovery Agent | Razorpay Hackathon Track 03</p>
      </footer>
    </div>
  );
};
