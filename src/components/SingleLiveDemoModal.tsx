import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShieldCheck, Cpu, RefreshCw, X, Play, DollarSign, Activity, Zap, User, Mail } from 'lucide-react';
import type { RecoveryCase } from '../types';

interface SingleLiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteLiveDemo: (caseData: RecoveryCase) => void;
}

export const SingleLiveDemoModal: React.FC<SingleLiveDemoModalProps> = ({
  isOpen,
  onClose,
  onCompleteLiveDemo
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // Editable custom test inputs
  const [customName, setCustomName] = useState<string>('Sneha (Your Test Customer)');
  const [customEmail, setCustomEmail] = useState<string>('sneha@merchantstore.in');
  const [customAmount, setCustomAmount] = useState<number>(4999.0);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setIsExecuting(false);
      setIsFormSubmitted(false);
    }
  }, [isOpen]);

  const handleStartSimulation = () => {
    setIsFormSubmitted(true);
    setCurrentStep(1);
    setIsExecuting(true);

    setTimeout(() => setCurrentStep(2), 1000);
    setTimeout(() => setCurrentStep(3), 2200);
    setTimeout(() => setCurrentStep(4), 3400);
    setTimeout(() => setCurrentStep(5), 4600);
    setTimeout(() => setCurrentStep(6), 5800);
    setTimeout(() => {
      setCurrentStep(7); // Completed state (all 6 steps done)
      setIsExecuting(false);
      // Create recovered case record with custom details
      const liveCase: RecoveryCase = {
        case_id: `case_demo_${Date.now()}`,
        customer_id: `cust_${customName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        customer_name: customName || "Test Customer",
        customer_email: customEmail || "test@merchantstore.in",
        transaction_id: `pay_live_${Math.floor(Math.random() * 89999 + 10000)}`,
        amount_at_risk: Number(customAmount) || 4999.0,
        estimated_recoverable: (Number(customAmount) || 4999.0) * 0.9,
        revenue_risk_type: "PAYMENT_FAILURE",
        failure_reason: "Issuing Bank Downtime (Transient Timeout)",
        failure_code: "BAD_REQUEST_ERROR",
        risk_score: 0.10,
        recoverability_score: 0.90,
        urgency: "HIGH",
        attempts_count: 1,
        max_attempts: 3,
        cooldown_hours: 4.0,
        state: "RECOVERED",
        current_action: "GENERATE_PAYMENT_LINK",
        is_escalated: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      onCompleteLiveDemo(liveCase);
    }, 7000);
  };

  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: "1. Event Ingestion Layer",
      desc: `Razorpay webhook payment.failed received (₹${customAmount.toLocaleString('en-IN')}). Customer: ${customName}. Timestamp & HMAC payload persisted.`,
      icon: Activity,
      color: "border-blue-500 bg-blue-500/10 text-blue-400"
    },
    {
      num: 2,
      title: "2. Revenue Risk Engine",
      desc: `Identified payment failure. Amount ₹${customAmount.toLocaleString('en-IN')} moved into Total Revenue at Risk for ${customName}.`,
      icon: DollarSign,
      color: "border-amber-500 bg-amber-500/10 text-amber-400"
    },
    {
      num: 3,
      title: "3. AI Diagnosis Agent",
      desc: `Analyzed failure code & customer history for ${customEmail}. Diagnosis: Transient Issuing Bank Downtime. Recovery Probability: 90%. Recommended Action: GENERATE_PAYMENT_LINK.`,
      icon: Cpu,
      color: "border-purple-500 bg-purple-500/10 text-purple-400"
    },
    {
      num: 4,
      title: "4. Policy & Guardrail Engine",
      desc: `Deterministic policy check: Amount (₹${customAmount.toLocaleString('en-IN')}) < Autonomous Cap (₹50,000). Retries (0/3) OK. Status: APPROVED.`,
      icon: ShieldCheck,
      color: "border-cyan-500 bg-cyan-500/10 text-cyan-400"
    },
    {
      num: 5,
      title: "5. Recovery Execution Layer",
      desc: `Generating Razorpay Smart Payment Link (plink_...) for ${customEmail} with 1-click completion URL & priority notification...`,
      icon: Zap,
      color: "border-emerald-500 bg-emerald-500/10 text-emerald-400"
    },
    {
      num: 6,
      title: "6. Event Observed & Money Recovered!",
      desc: `Razorpay payment_link.paid / payment.captured event received! ₹${customAmount.toLocaleString('en-IN')} successfully recovered for ${customName} and credited.`,
      icon: CheckCircle2,
      color: "border-emerald-400 bg-emerald-500/20 text-emerald-300"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Play className="w-6 h-6 fill-current" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Payment Failure Recovery Workflow</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                SIMULATION DEMO MODE
              </span>
            </div>
            <p className="text-xs text-slate-400">Autonomous Closed-Loop Pipeline Execution & Razorpay API Link Generation</p>
          </div>
        </div>

        {/* Input Form before execution */}
        {!isFormSubmitted && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 mb-6 space-y-4">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Test Event Parameters</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Customer Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter customer name..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Customer Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="Enter email..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Failed Amount (₹)</label>
                <div className="relative">
                  <span className="text-slate-500 absolute left-3 top-1.5 text-xs font-bold">₹</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(Number(e.target.value))}
                    placeholder="4999"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleStartSimulation}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-emerald-900/30 transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Run Autonomous Recovery Test</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step Progress Timeline */}
        {isFormSubmitted && (
          <div className="space-y-3 mb-6">
            {steps.map((step) => {
              const Icon = step.icon;
              const isDone = currentStep > step.num;
              const isCurrent = currentStep === step.num;

              return (
                <div
                  key={step.num}
                  className={`p-3.5 rounded-xl border transition-all duration-500 flex items-start gap-3 ${
                    isCurrent
                      ? `${step.color} shadow-lg ring-1 ring-cyan-500/50 scale-[1.01]`
                      : isDone
                      ? 'border-emerald-500/30 bg-emerald-500/5 text-slate-300'
                      : 'border-slate-800 bg-slate-900/50 text-slate-600 opacity-60'
                  }`}
                >
                  <div className="mt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
                    ) : (
                      <Icon className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-white mb-0.5">{step.title}</h4>
                    <p className="text-[11px] leading-relaxed text-slate-300">{step.desc}</p>
                  </div>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">
                      EXECUTING
                    </span>
                  )}
                  {isDone && step.num === 6 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      RECOVERED ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Policy Engine Guardrails Active</span>
          </div>

          <button
            onClick={onClose}
            disabled={isExecuting}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              isExecuting
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-md shadow-cyan-900/30'
            }`}
          >
            {isExecuting ? "Agent Executing..." : "Close & View Updated Dashboard"}
          </button>
        </div>
      </div>
    </div>
  );
};
