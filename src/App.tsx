import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { RecoveryCasesView } from './components/RecoveryCasesView';
import { PolicyEngineView } from './components/PolicyEngineView';
import { HumanEscalationView } from './components/HumanEscalationView';
import { AuditLogView } from './components/AuditLogView';
import { SingleLiveDemoModal } from './components/SingleLiveDemoModal';
import { BatchSimulationModal } from './components/BatchSimulationModal';
import { CaseDetailModal } from './components/CaseDetailModal';
import { LoginModal } from './components/LoginModal';
import { LoginView } from './components/LoginView';

import type { 
  RecoveryCase, DashboardMetrics, AgentActivityMessage, 
  AuditLogItem, PolicyConfig, BatchReport 
} from './types';
import { 
  initialPolicyConfig, initialMetrics, initialCases, 
  initialActivities, initialAuditLogs 
} from './mockData';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [cases, setCases] = useState<RecoveryCase[]>(initialCases);
  const [metrics, setMetrics] = useState<DashboardMetrics>(initialMetrics);
  const [activities, setActivities] = useState<AgentActivityMessage[]>(initialActivities);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(initialAuditLogs);
  const [policy, setPolicy] = useState<PolicyConfig>(initialPolicyConfig);

  const [selectedCase, setSelectedCase] = useState<RecoveryCase | null>(null);
  const [selectedRiskType, setSelectedRiskType] = useState<string>('ALL');

  const [isSingleDemoOpen, setIsSingleDemoOpen] = useState<boolean>(false);
  const [isBatchSimOpen, setIsBatchSimOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [wsConnected, setWsConnected] = useState<boolean>(false);

  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("recoverai_merchant_logged_in") === "true";
  });

  const [currentMerchant, setCurrentMerchant] = useState<{ merchant_id: string; name: string; company_name: string; email: string } | null>(() => {
    const saved = localStorage.getItem("recoverai_merchant_profile");
    return saved ? JSON.parse(saved) : {
      merchant_id: "mch_8829_techcorp",
      name: "Rajesh Kumar",
      company_name: "TechCorp India Pvt Ltd",
      email: "rajesh@techcorp.in"
    };
  });

  const handleLoginSuccess = (merchant: { merchant_id: string; name: string; company_name: string; email: string }) => {
    setCurrentMerchant(merchant);
    setIsLoggedIn(true);
    localStorage.setItem("recoverai_merchant_logged_in", "true");
    localStorage.setItem("recoverai_merchant_profile", JSON.stringify(merchant));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("recoverai_merchant_logged_in");
  };

  // Attempt WebSocket connection to FastAPI backend at ws://localhost:8000/ws/events
  useEffect(() => {
    let socket: WebSocket | null = null;
    try {
      socket = new WebSocket("ws://localhost:8000/ws/events");
      socket.onopen = () => {
        setWsConnected(true);
      };
      socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          handleWebSocketMessage(msg);
        } catch (e) {
          console.error("Error parsing WS message", e);
        }
      };
      socket.onclose = () => {
        setWsConnected(false);
      };
      socket.onerror = () => {
        setWsConnected(false);
      };
    } catch (e) {
      setWsConnected(false);
    }

    return () => {
      if (socket) socket.close();
    };
  }, []);

  // Recalculate metrics whenever cases change
  useEffect(() => {
    const totalRisk = cases.reduce((acc, c) => acc + c.amount_at_risk, 0);
    const estRecoverable = cases.reduce((acc, c) => acc + c.estimated_recoverable, 0);
    const recoveredCases = cases.filter(c => c.state === 'RECOVERED');
    const totalRecovered = recoveredCases.reduce((acc, c) => acc + c.amount_at_risk, 0);
    const activeCount = cases.filter(c => ['DETECTED', 'DIAGNOSING', 'ACTION_EXECUTING', 'RETRY_REQUIRED'].includes(c.state)).length;
    const escalatedCount = cases.filter(c => c.state === 'ESCALATED' || c.is_escalated).length;
    const failedCount = cases.filter(c => ['STOPPED', 'FAILED'].includes(c.state)).length;

    const rate = totalRisk > 0 ? (totalRecovered / totalRisk) * 100 : 0;

    setMetrics({
      total_revenue_at_risk: totalRisk,
      estimated_recoverable_revenue: estRecoverable,
      revenue_recovered: totalRecovered,
      recovery_rate_percent: Math.round(rate * 10) / 10,
      active_cases: activeCount,
      failed_recoveries: failedCount,
      escalations: escalatedCount,
      amount_saved: totalRecovered,
      total_cases_count: cases.length
    });
  }, [cases]);

  const handleWebSocketMessage = (msg: any) => {
    const timestamp = new Date().toLocaleTimeString();
    if (msg.type === 'EVENT_INGESTED') {
      const act: AgentActivityMessage = {
        id: `act_${Date.now()}`,
        timestamp,
        message: `Payment failure detected — ${msg.data.customer_id} (₹${msg.data.amount})`,
        type: 'DETECT',
        amount: msg.data.amount
      };
      setActivities(prev => [act, ...prev]);
    } else if (msg.type === 'AGENT_DIAGNOSED') {
      const act: AgentActivityMessage = {
        id: `act_${Date.now()}`,
        timestamp,
        message: `AI Diagnosis: ${msg.data.diagnosis} (Prob: ${Math.round(msg.data.recovery_probability * 100)}%)`,
        type: 'DIAGNOSE'
      };
      setActivities(prev => [act, ...prev]);
    } else if (msg.type === 'REVENUE_RECOVERED') {
      const act: AgentActivityMessage = {
        id: `act_${Date.now()}`,
        timestamp,
        message: `SUCCESS! ₹${msg.data.amount_recovered} recovered — ${msg.data.customer_name}`,
        type: 'RECOVERED',
        amount: msg.data.amount_recovered
      };
      setActivities(prev => [act, ...prev]);
    }
  };

  const handleCompleteLiveDemo = (newCase: RecoveryCase) => {
    setCases(prev => [newCase, ...prev]);
    const act: AgentActivityMessage = {
      id: `act_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      case_id: newCase.case_id,
      message: `₹4,999.00 payment failure recovered autonomously into settlement account.`,
      type: 'RECOVERED',
      amount: 4999.0
    };
    setActivities(prev => [act, ...prev]);

    const audit: AuditLogItem = {
      log_id: `log_live_${Date.now()}`,
      case_id: newCase.case_id,
      timestamp: new Date().toISOString(),
      agent_reasoning: "Live single recovery demo executed successfully.",
      policy_decision: "APPROVED",
      action_executed: "GENERATE_PAYMENT_LINK",
      result_summary: "₹4,999 recovered via Razorpay Sandbox payment link.",
      state_from: "ACTION_EXECUTING",
      state_to: "RECOVERED"
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  const handleResolveEscalation = (caseId: string, action: 'APPROVE' | 'DISMISS') => {
    setCases(prev => prev.map(c => {
      if (c.case_id === caseId) {
        return {
          ...c,
          state: action === 'APPROVE' ? 'RECOVERED' : 'STOPPED',
          is_escalated: false,
          updated_at: new Date().toISOString()
        };
      }
      return c;
    }));
  };

  const handleRunBatch = async (scenarioType: string, eventCount: number): Promise<BatchReport> => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/simulation/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario_type: scenarioType, event_count: eventCount })
      });
      if (res.ok) {
        const reportData: BatchReport = await res.json();
        const casesRes = await fetch("http://localhost:8000/api/v1/cases");
        if (casesRes.ok) {
          const freshCases = await casesRes.json();
          setCases(freshCases);
        }
        return reportData;
      }
    } catch (e) {
      console.log("Backend not available, calculating client batch simulation...");
    }

    const simulatedCases: RecoveryCase[] = [];
    let totalRisk = 0;
    let totalEst = 0;
    let totalRecovered = 0;
    let successfulCount = 0;

    for (let i = 0; i < eventCount; i++) {
      const isSuccess = Math.random() < 0.72;
      const amount = Math.floor(Math.random() * 25000 + 1500);
      const est = amount * 0.8;
      totalRisk += amount;
      totalEst += est;
      if (isSuccess) {
        totalRecovered += amount;
        successfulCount++;
      }

      simulatedCases.push({
        case_id: `case_batch_${i}_${Date.now()}`,
        customer_id: `cust_batch_${i}`,
        customer_name: `Client #${i + 100}`,
        customer_email: `client_${i}@store.com`,
        transaction_id: `pay_sim_${i}_${Math.floor(Math.random() * 90000)}`,
        amount_at_risk: amount,
        estimated_recoverable: est,
        revenue_risk_type: i % 3 === 0 ? "PAYMENT_FAILURE" : (i % 3 === 1 ? "CHECKOUT_ABANDONMENT" : "B2B_RECEIVABLE"),
        failure_reason: "Automated Batch Scenario Event",
        risk_score: 0.2,
        recoverability_score: 0.8,
        urgency: amount > 15000 ? "HIGH" : "MEDIUM",
        attempts_count: 1,
        max_attempts: 3,
        cooldown_hours: 4.0,
        state: isSuccess ? "RECOVERED" : "ESCALATED",
        current_action: isSuccess ? "GENERATE_PAYMENT_LINK" : "ESCALATE_TO_HUMAN",
        is_escalated: !isSuccess,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    setCases(prev => [...simulatedCases, ...prev]);

    return {
      total_events_processed: eventCount,
      total_revenue_at_risk: totalRisk,
      estimated_recoverable_revenue: totalEst,
      total_revenue_recovered: totalRecovered,
      recovery_rate_percent: Math.round((totalRecovered / totalRisk) * 1000) / 10,
      successful_interventions: successfulCount,
      failed_interventions: eventCount - successfulCount,
      escalated_cases: Math.floor((eventCount - successfulCount) * 0.6),
      stopped_cases: Math.floor((eventCount - successfulCount) * 0.4),
      roi_multiple: Math.round((totalRecovered / (totalRisk * 0.05 + 1)) * 10) / 10,
      recovery_by_type: {
        "PAYMENT_FAILURE": totalRecovered * 0.45,
        "CHECKOUT_ABANDONMENT": totalRecovered * 0.35,
        "B2B_RECEIVABLE": totalRecovered * 0.20
      }
    };
  };

  // Render Login Landing Page if not logged in
  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onTriggerSingleDemo={() => setIsSingleDemoOpen(true)}
        onOpenBatchSim={() => setIsBatchSimOpen(true)}
        wsConnected={wsConnected}
        activeEscalationCount={cases.filter(c => c.state === 'ESCALATED' || c.is_escalated).length}
        currentMerchant={currentMerchant}
        onOpenLogin={handleLogout}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            metrics={metrics}
            cases={cases}
            activities={activities}
            onSelectCase={setSelectedCase}
            onFilterType={setSelectedRiskType}
            selectedRiskType={selectedRiskType}
          />
        )}

        {activeTab === 'cases' && (
          <RecoveryCasesView
            cases={cases}
            onSelectCase={setSelectedCase}
          />
        )}

        {activeTab === 'control' && (
          <PolicyEngineView
            policy={policy}
            onUpdatePolicy={setPolicy}
          />
        )}

        {activeTab === 'escalations' && (
          <HumanEscalationView
            cases={cases}
            onResolveEscalation={handleResolveEscalation}
            onSelectCase={setSelectedCase}
          />
        )}

        {activeTab === 'audit' && (
          <AuditLogView logs={auditLogs} />
        )}

        {activeTab === 'batch' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-white">Batch Simulation & Scenario Generator</h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Simulate complex multi-channel revenue loss scenarios to measure baseline loss vs recovered money across batch payment streams.
            </p>
            <button
              onClick={() => setIsBatchSimOpen(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-900/30 transition"
            >
              Open Batch Simulation Lab
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      <SingleLiveDemoModal
        isOpen={isSingleDemoOpen}
        onClose={() => setIsSingleDemoOpen(false)}
        onCompleteLiveDemo={handleCompleteLiveDemo}
      />

      <BatchSimulationModal
        isOpen={isBatchSimOpen}
        onClose={() => setIsBatchSimOpen(false)}
        onRunBatch={handleRunBatch}
      />

      <CaseDetailModal
        caseData={selectedCase}
        onClose={() => setSelectedCase(null)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
export default App;
