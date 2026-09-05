import React, { useState } from 'react';
import { 
  Sparkles, Zap, Lock, Activity, Bot
} from 'lucide-react';
import { LoginModal } from './LoginModal';

interface LoginViewProps {
  onLoginSuccess: (merchant: { merchant_id: string; name: string; company_name: string; email: string }) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-sky-500 selection:text-white relative overflow-hidden font-sans">
      {/* Background Subtle Fine Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none z-0" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} 
      />

      {/* Prominent Sky Blue / Cyan Ambient Radial Light Bursts (Mandamus Screenshot Layout) */}
      <div className="absolute top-10 -left-32 w-[750px] h-[650px] bg-sky-500/25 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-[650px] h-[600px] bg-cyan-600/20 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Header with Centered Capsule Navigation & Clean Logo */}
      <header className="fixed top-0 left-0 right-0 z-50 py-5 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Brand Name - Clean Uppercase Bold (Mandamus Screenshot) */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-400 via-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-2xl text-white tracking-widest uppercase">RECOVERAI</span>
          </div>

          {/* Floating Center Capsule Nav */}
          <nav className="hidden md:flex items-center gap-8 px-7 py-2.5 rounded-full bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-2xl">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xs font-semibold text-slate-100 hover:text-sky-400 transition"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-xs font-semibold text-slate-400 hover:text-sky-400 transition"
            >
              How it works
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-xs font-semibold text-slate-400 hover:text-sky-400 transition"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-xs font-semibold text-slate-400 hover:text-sky-400 transition"
            >
              About
            </button>
          </nav>

          {/* Top-Right Sky Blue Sign In Pill Button */}
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-7 py-2.5 rounded-full bg-gradient-to-r from-sky-400 via-cyan-500 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-white font-bold text-xs shadow-xl shadow-sky-500/30 transition active:scale-95"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="relative pt-44 pb-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center z-10">
        {/* Sky Blue Outlined Top Badge */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-sky-400/40 bg-sky-500/10 text-sky-300 text-[11px] font-bold tracking-widest uppercase mb-8 shadow-lg shadow-sky-500/10">
          RAZORPAY AI REVENUE PLATFORM
        </div>

        {/* Hero Title */}
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
            onClick={() => setShowLoginModal(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-sky-400 via-cyan-500 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-white font-bold text-xs tracking-wide shadow-xl shadow-sky-500/30 transition active:scale-95 flex items-center justify-center gap-2"
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

      {/* Floating Bottom-Right Assistant Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <div className="hidden sm:block max-w-xs bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-bold text-sky-400 tracking-wider uppercase">AI Agent Active</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Click <strong>Sign In</strong> or <strong>Explore Platform</strong> to access the merchant portal.
          </p>
        </div>
        <button
          onClick={() => setShowLoginModal(true)}
          className="h-12 w-12 rounded-full bg-gradient-to-tr from-sky-400 via-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-xl shadow-sky-500/30 hover:scale-105 transition active:scale-95"
          title="Sign In"
        >
          <Bot className="w-6 h-6" />
        </button>
      </div>

      {/* Section: How It Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[11px] font-extrabold text-sky-400 tracking-widest uppercase">AUTOMATED RECOVERY ENGINE</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">How RecoverAI Operates</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A closed-loop AI agent pipeline that intercepts payment failures directly via Razorpay Webhooks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-sky-500/50 transition">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-xs mb-4 border border-sky-500/20">
              01
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Signal Interception</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Razorpay HMAC Webhooks emit instant transaction failure payloads (`payment.failed`, `order.paid`).
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-cyan-500/50 transition">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs mb-4 border border-cyan-500/20">
              02
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Root-Cause Diagnosis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              LLM diagnoses exact decline causes (card limit exceeded, bank downtime, auth timeout).
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-blue-500/50 transition">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs mb-4 border border-blue-500/20">
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
          <span className="text-[11px] font-extrabold text-sky-400 tracking-widest uppercase">PLATFORM CAPABILITIES</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Built for Razorpay Merchants</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Enterprise-grade safety, closed-loop execution, and real-time dashboard analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
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
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
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
          <span className="px-3.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-bold">
            Autonomous Agent
          </span>
          <h2 className="text-3xl font-black text-white">Autonomous Revenue Recovery</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            RecoverAI bridges the gap between transaction declines and merchant wallet settlement using closed-loop autonomous AI agents.
          </p>
          <div className="pt-2 flex items-center justify-center gap-4">
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-sky-400 via-cyan-500 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-white font-bold text-xs tracking-wider shadow-lg transition active:scale-95"
            >
              Sign In to Merchant Portal Now
            </button>
          </div>
        </div>
      </section>

      {/* Merchant Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={onLoginSuccess}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center text-xs text-slate-500 z-10 relative">
        <p>RECOVERAI — Real-Time Autonomous Revenue Recovery Platform | Built for businesses using Razorpay</p>
      </footer>
    </div>
  );
};
