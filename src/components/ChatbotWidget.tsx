import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, RefreshCw, Minimize2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: string[];
}

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'bot',
      text: '👋 Hello! I am your RecoverAI Assistant. Ask me anything about how our autonomous agent intercepts payment declines, Razorpay API integrations, or policy guardrails!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: [
        'How does RecoverAI work?',
        'What is the policy engine limit?',
        'How are payments recovered?',
        'How do I test the live demo?'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const generateAnswer = (query: string): { text: string; quickReplies?: string[] } => {
    const q = query.toLowerCase();

    if (q.includes('how does') || q.includes('work') || q.includes('what is recoverai') || q.includes('concept')) {
      return {
        text: "RecoverAI is a real-time autonomous revenue recovery agent built for Razorpay merchants. It intercepts payment failures via webhooks (`payment.failed`), diagnoses decline causes using AI, enforces merchant policy rules, generates Razorpay Smart Payment Links (`plink_...`), and dispatches priority SMS/WhatsApp alerts to recover revenue automatically.",
        quickReplies: ['What is the policy engine limit?', 'How are payments recovered?', 'How do I test the live demo?']
      };
    }

    if (q.includes('policy') || q.includes('limit') || q.includes('safety') || q.includes('guardrail') || q.includes('risk')) {
      return {
        text: "Safety is our top priority! RecoverAI operates strictly within merchant-defined policy guardrails:\n• Max single recovery cap (e.g. ₹50,000)\n• Max retry attempts (e.g. 3 retries max)\n• Cooldown hours (e.g. 4-hour wait between retries)\n\nAny attempt exceeding these caps is automatically routed to the Human Escalation Queue for manual review.",
        quickReplies: ['How are payments recovered?', 'How do I test the live demo?']
      };
    }

    if (q.includes('recover') || q.includes('payment link') || q.includes('razorpay') || q.includes('plink')) {
      return {
        text: "When a decline occurs, RecoverAI calls the Razorpay REST API (`POST /v1/payment_links`) to generate a unique Smart Payment Link. The customer receives an SMS/WhatsApp notification with 1-click access to pay via UPI, Netbanking, or Cards. When paid, Razorpay sends a `payment_link.paid` webhook, updating your dashboard in real time!",
        quickReplies: ['How does RecoverAI work?', 'How do I test the live demo?']
      };
    }

    if (q.includes('test') || q.includes('demo') || q.includes('try') || q.includes('simulate')) {
      return {
        text: "You can test RecoverAI in two easy ways:\n1. Click '1-Click Demo Login' to enter the TechCorp India merchant portal.\n2. In the dashboard header, click 'Simulate Single ₹4,999 Failure' to watch the agent detect, diagnose, and recover a live simulated transaction in under 10 seconds!",
        quickReplies: ['How does RecoverAI work?', 'What is the policy engine limit?']
      };
    }

    if (q.includes('api key') || q.includes('webhook') || q.includes('secret') || q.includes('connect')) {
      return {
        text: "RecoverAI supports dual modes:\n• Real Razorpay Mode: Uses your `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` for real REST API calls & HMAC verification.\n• Simulation Mode: Runs built-in sandbox event generators when API keys are omitted.",
        quickReplies: ['How does RecoverAI work?', 'What is the policy engine limit?']
      };
    }

    if (q.includes('audit') || q.includes('log') || q.includes('history') || q.includes('ledger')) {
      return {
        text: "Every action taken by RecoverAI is hash-signed and recorded in an immutable Audit Trail Ledger. You can inspect exact agent reasoning, policy decision timestamps, state changes, and HMAC signatures under the 'Audit Trail' tab.",
        quickReplies: ['What is the policy engine limit?', 'How do I test the live demo?']
      };
    }

    if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('good')) {
      return {
        text: "Hello! How can I assist you today with RecoverAI revenue recovery?",
        quickReplies: ['How does RecoverAI work?', 'What is the policy engine limit?', 'How do I test the live demo?']
      };
    }

    return {
      text: `I understand you are asking about "${query}". RecoverAI automates revenue recovery for Razorpay merchants by listening to payment failures, running AI diagnosis, applying merchant safety guardrails, and issuing Smart Payment Links. Is there a specific topic you'd like to explore?`,
      quickReplies: ['How does RecoverAI work?', 'What is the policy engine limit?', 'How are payments recovered?']
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const answer = generateAnswer(query);
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: answer.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: answer.quickReplies
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Closed State Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-2xl shadow-cyan-500/40 transition-all duration-300 active:scale-95"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
          </span>
          <Bot className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
          <span className="tracking-wide">Ask RecoverAI Chatbot</span>
        </button>
      )}

      {/* Open Chat Drawer Window */}
      {isOpen && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl w-[360px] sm:w-[400px] h-[520px] shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white leading-none">RecoverAI Assistant</h3>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Real-Time AI Support</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([
                  {
                    id: 'msg_welcome',
                    sender: 'bot',
                    text: '👋 Hello! I am your RecoverAI Assistant. Ask me anything about how our autonomous agent intercepts payment declines, Razorpay API integrations, or policy guardrails!',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    quickReplies: [
                      'How does RecoverAI work?',
                      'What is the policy engine limit?',
                      'How are payments recovered?',
                      'How do I test the live demo?'
                    ]
                  }
                ])}
                title="Reset conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar bg-slate-950/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-start gap-2 max-w-[85%]">
                  {msg.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold mt-1 flex-shrink-0">
                      AI
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-2.5 text-xs whitespace-pre-wrap leading-relaxed shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>

                <span className="text-[9px] text-slate-500 mt-1 px-1 font-mono">
                  {msg.timestamp}
                </span>

                {/* Quick Reply Chips */}
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                    {msg.quickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(reply)}
                        className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-[10px] font-medium text-cyan-400 hover:text-cyan-300 transition text-left"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold">
                  AI
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl px-3 py-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask any question about RecoverAI..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white transition flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
