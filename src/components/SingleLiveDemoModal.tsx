import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShieldCheck, Cpu, RefreshCw, X, Play, DollarSign, Activity, Zap } from 'lucide-react';
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

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setIsExecuting(true);

      const timer1 = setTimeout(() => setCurrentStep(2), 1200);
      const timer2 = setTimeout(() => setCurrentStep(3), 2600);
      const timer3 = setTimeout(() => setCurrentStep(4), 4000);
      const timer4 = setTimeout(() => setCurrentStep(5), 5400);
      const timer5 = setTimeout(() => {
        setCurrentStep(6);
        setIsExecuting(false);
        // Create recovered case record
        const liveCase: RecoveryCase = {
          case_id: `case_demo_${Date.now()}`,
          customer_id: "cust_aarav_sharma",
          customer_name: "Aarav Sharma",
          customer_email: "aarav.sharma@techcorp.in",
          transaction_id: `pay_live_${Math.floor(Math.random() * 89999 + 10000)}`,
          amount_at_risk: 4999.0,
          estimated_recoverable: 4499.1,
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
      }, 6800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: "1. Event Ingestion Layer",
      desc: "Razorpay webhook payment.failed received (₹4,999.00). Timestamp & HMAC payload persisted.",
      icon: Activity,
      color: "border-blue-500 bg-blue-500/10 text-blue-400"
    },
    {
      num: 2,
      title: "2. Revenue Risk Engine",
      desc: "Identified payment failure. Amount ₹4,999 moved into Total Revenue at Risk.",
      icon: DollarSign,
      color: "border-amber-500 bg-amber-500/10 text-amber-400"
    },
    {
      num: 3,
      title: "3. AI Diagnosis Agent",
      desc: "Analyzed failure code & customer history. Diagnosis: Transient Issuing Bank Downtime. Recovery Probability: 90%. Recommended Action: GENERATE_PAYMENT_LINK.",
      icon: Cpu,
      color: "border-purple-500 bg-purple-500/10 text-purple-400"
    },
    {
      num: 4,
      title: "4. Policy & Guardrail Engine",
      desc: "Deterministic policy check: Amount (₹4,999) < Autonomous Cap (₹50,000). Retries (0/3) OK. Status: APPROVED.",
      icon: ShieldCheck,
      color: "border-cyan-500 bg-cyan-500/10 text-cyan-400"
    },
    {
      num: 5,
      title: "5. Recovery Execution Layer",
      desc: "Generating Razorpay Smart Payment Link (plink_...) with 1-click completion URL & priority notification...",
      icon: Zap,
      color: "border-emerald-500 bg-emerald-500/10 text-emerald-400"
    },
    {
      num: 6,
      title: "6. Event Observed & Money Recovered!",
      desc: "Razorpay payment_link.paid / payment.captured event received! ₹4,999.00 successfully recovered and credited.",
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
          <div>
            <h2 className="text-lg font-bold text-white">Live Single Recovery Event Simulation</h2>
            <p className="text-xs text-slate-400">Autonomous Closed-Loop Demo: ₹4,999 Payment Failure Case</p>
          </div>
        </div>

        {/* Step Progress Timeline */}
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
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Policy Engine Authority Enforced</span>
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
            {isExecuting ? "Agent Executing..." : "Close & View Dashboard Metrics"}
          </button>
        </div>
      </div>
    </div>
  );
};
