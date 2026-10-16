import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Bot,
  Send,
  Sparkles,
  Terminal,
  ShieldAlert,
  HelpCircle,
  TrendingDown,
  Info,
} from 'lucide-react';
import { Button } from '../components/common/Button.tsx';
import {
  formatCurrency,
  calculateStats,
  calculateCategoryTotals,
} from '../lib/finance.js';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiAssistantPage: React.FC = () => {
  const { appState } = useOutletContext<any>();
  const currency = appState?.user?.currency || 'INR';
  const transactions = appState?.transactions || [];
  const goals = appState?.goals || [];

  const stats = calculateStats(transactions);
  const { breakdown } = calculateCategoryTotals(transactions);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message from Terminal Analyst
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'assistant',
      text: `VELORA FINANCIAL TERMINAL ANALYST // INITIALIZED.
Ledger records loaded: ${transactions.length} entries. Net Balance: ${formatCurrency(stats.netBalance, currency)}. Current Savings Velocity: ${stats.savingsRate}%.

I provide direct, institutional-grade cashflow analysis without fluff. Ask me to audit specific categories, evaluate big purchases, or calculate your burn rate.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Suggested prompt chips
  const promptChips = [
    'Audit my food & dining spend this month',
    `Can I afford a ${currency === 'INR' ? '₹3,000' : '$40'} weekend concert ticket?`,
    'How do I increase my savings rate by 10%?',
    'Calculate my daily cashflow burn rate and runway',
    'Evaluate my top outflow category vs student benchmarks',
  ];

  // 5 Hardcoded Demo Mode Responses for realistic offline fallback
  const getDemoResponse = (query: string): string => {
    const q = query.toLowerCase();
    const topCategory = breakdown[0] || { category: 'Food', amount: 0, percentage: 0 };

    if (q.includes('food') || q.includes('dining') || q.includes('canteen')) {
      const foodSpend = breakdown.find((b) => b.category === 'Food')?.amount || 0;
      return `AUDIT REPORT: FOOD & DINING OUTFLOW
Current recorded spend: ${formatCurrency(foodSpend, currency)}.
Share of total outflow: ${stats.totalExpenses > 0 ? ((foodSpend / stats.totalExpenses) * 100).toFixed(1) : 0}%.

TERMINAL DIRECTIVE:
1. Campus cafeteria meals and takeout deliveries represent the highest frequency micro-drag for students.
2. Setting a hard weekly dining allowance of ${formatCurrency(foodSpend > 0 ? foodSpend * 0.7 : 1500, currency)} will recapture approximately ${formatCurrency(foodSpend > 0 ? foodSpend * 0.3 : 600, currency)} per month into your savings reserve.
3. Switch 2 weekly dining outings to batch cooking or campus mess plan to eliminate 25% of this drag.`;
    }

    if (q.includes('afford') || q.includes('concert') || q.includes('ticket') || q.includes('purchase')) {
      const isBufferHealthy = stats.netBalance > (currency === 'INR' ? 10000 : 150);
      return `AFFORDABILITY EVALUATION // DISCRETIONARY EXPENSE
Evaluating proposed discretionary outflow against net balance (${formatCurrency(stats.netBalance, currency)}).

VERDICT: ${isBufferHealthy ? 'PERMISSIBLE WITH OFFSET' : 'HIGH RISK — REJECTED'}
- Inflow buffer: ${formatCurrency(stats.netBalance, currency)}.
- Active savings targets requiring allocation: ${goals.length} target(s).

ANALYST ADVICE:
${
  isBufferHealthy
    ? `You have sufficient capital buffer, but this purchase will reduce your monthly savings velocity from ${stats.savingsRate}% to approximately ${Math.max(0, stats.savingsRate - 4)}%. To offset this, cut discretionary shopping or entertainment spend over the next 10 days.`
    : `Your net cashflow margin is too compressed (${stats.savingsRate}% savings rate). Incurring this expense now increases your probability of end-of-month cash deficit. Defer until next income cycle.`
}`;
    }

    if (q.includes('increase') || q.includes('rate') || q.includes('10%')) {
      const targetSavings = stats.totalIncome * 0.1;
      return `SAVINGS ACCELERATION PROTOCOL // +10% GOAL
Current Savings Rate: ${stats.savingsRate}%
Target Savings Rate: ${(stats.savingsRate + 10).toFixed(1)}%

REQUIRED CAPITAL RECAPTURE:
You need to identify ${formatCurrency(targetSavings, currency)} in monthly expense reductions or incremental inflow.

ACTIONABLE STEPS:
1. Target your largest expenditure: ${topCategory.category} (${formatCurrency(topCategory.amount, currency)}). Reducing this category by 15% yields ${formatCurrency(topCategory.amount * 0.15, currency)}.
2. Audit recurring subscriptions and mobile/Wi-Fi bills to recover 5-8%.
3. Channel the surplus immediately to your "${goals[0]?.title || 'Emergency Cushion'}" target on payday before discretionary spending begins.`;
    }

    if (q.includes('burn rate') || q.includes('runway') || q.includes('daily')) {
      const daysCount = 30;
      const dailyBurn = stats.totalExpenses > 0 ? stats.totalExpenses / daysCount : 0;
      const daysRunway = dailyBurn > 0 && stats.netBalance > 0 ? Math.round(stats.netBalance / dailyBurn) : 0;

      return `CASHFLOW BURN & RUNWAY TELEMETRY
- Average Daily Outflow: ${formatCurrency(dailyBurn, currency)} / day.
- Current Net Reserve: ${formatCurrency(stats.netBalance, currency)}.
- Estimated Runway without fresh inflow: ~${daysRunway} days.

TERMINAL ASSESSMENT:
${
  daysRunway >= 30
    ? 'Your capital runway exceeds 30 days. Maintain this buffer to protect against semester fee bumps or delayed stipends.'
    : 'Your runway is under 30 days. Student cashflow vulnerability detected. Prioritize replenishing your emergency fund to 60 days of basic expenses.'
}`;
    }

    // Default top category benchmark review
    return `EXPENDITURE BENCHMARK ANALYSIS
Total Inflow: ${formatCurrency(stats.totalIncome, currency)}
Total Outflow: ${formatCurrency(stats.totalExpenses, currency)}
Dominant Category: ${topCategory.category} (${topCategory.percentage}% of total outflow).

INSTITUTIONAL CRITIQUE:
1. Student benchmark standard: 50% Essentials (Rent, Food, Transport), 30% Lifestyle & Social, 20% Savings.
2. Your current allocation: ${(100 - stats.savingsRate).toFixed(1)}% Outflow vs ${stats.savingsRate}% Savings.
3. Priority recommendation: Cap ${topCategory.category} expenditure at ${formatCurrency(topCategory.amount * 0.85, currency)} next cycle to boost buffer.`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare ledger payload for server-side Gemini
    const ledgerSummary = {
      user: appState?.user,
      stats,
      topCategories: breakdown.slice(0, 5),
      recentTransactions: transactions.slice(0, 8),
      goals: goals.map((g: any) => ({
        title: g.title,
        target: g.targetAmount,
        current: g.currentAmount,
        targetDate: g.targetDate,
      })),
    };

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          ledgerSummary,
          history: messages.slice(-4),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();

      if (data.demoMode || !data.reply) {
        setIsDemoMode(true);
        // Fall back to offline demo response
        const fallbackText = getDemoResponse(query);
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            sender: 'assistant',
            text: fallbackText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        setIsDemoMode(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            sender: 'assistant',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      console.warn('API error, falling back to local terminal emulator:', err);
      setIsDemoMode(true);
      const fallbackText = getDemoResponse(query);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}>
            AI Financial Terminal Analyst
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--cream-dim)' }}>
            Institutional financial advisor connected directly to your personal ledger.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isDemoMode ? 'var(--warning-bg)' : 'rgba(76, 175, 130, 0.15)',
              color: isDemoMode ? 'var(--warning)' : 'var(--positive)',
              fontWeight: 600,
              border: isDemoMode ? '1px solid rgba(232, 168, 56, 0.3)' : '1px solid rgba(76, 175, 130, 0.3)',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
            <span>{isDemoMode ? 'Terminal Demo Mode' : 'Gemini 3.8 Flash Online'}</span>
          </span>
        </div>
      </div>

      {/* Demo Mode Notice Banner if active */}
      {isDemoMode && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--warning-bg)',
            border: '1px solid rgba(232, 168, 56, 0.3)',
            color: 'var(--warning)',
            fontSize: '0.8125rem',
          }}
        >
          <Info size={18} style={{ flexShrink: 0 }} />
          <span>
            <strong>Demo Terminal Mode:</strong> Operating in deterministic offline mode. The assistant answers with calculated cashflow audits based on your real transactions.
          </span>
        </div>
      )}

      {/* Terminal Chat Window */}
      <div className="terminal-card">
        {/* Terminal Window Header */}
        <div className="terminal-header">
          <div className="terminal-dots">
            <span className="terminal-dot red" />
            <span className="terminal-dot yellow" />
            <span className="terminal-dot green" />
            <span style={{ marginLeft: '0.75rem', fontSize: '0.75rem', color: 'var(--cream-dim)', fontFamily: 'monospace' }}>
              velora-fin-analyst://session-active [tabular-nums]
            </span>
          </div>

          <div style={{ fontSize: '0.6875rem', color: 'var(--cream-subtle)' }}>
            Context: {transactions.length} Ledger Records Loaded
          </div>
        </div>

        {/* Message Stream */}
        <div className="terminal-body">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-bubble ${msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.6875rem',
                  color: 'var(--cream-subtle)',
                  marginBottom: '0.4rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                <span>{msg.sender === 'user' ? 'You' : 'Velora Terminal Mentor'}</span>
                <span>·</span>
                <span>{msg.timestamp}</span>
              </div>
              <div style={{ whiteSpace: 'pre-wrap', fontFamily: msg.sender === 'assistant' ? 'inherit' : 'inherit' }}>
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="chat-bubble chat-bubble-assistant" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                className="spinner-icon"
                style={{
                  width: '14px',
                  height: '14px',
                  border: '2px solid var(--accent)',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  display: 'inline-block',
                }}
              />
              <span style={{ fontSize: '0.8125rem', color: 'var(--cream-dim)' }}>
                Auditing transaction telemetry & formulating directives...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="prompt-chips-row">
          <span style={{ fontSize: '0.6875rem', color: 'var(--cream-subtle)', alignSelf: 'center', marginRight: '0.25rem' }}>
            Suggested:
          </span>
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              className="prompt-chip"
              onClick={() => handleSendMessage(chip)}
              disabled={isLoading}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="terminal-input-bar">
          <input
            type="text"
            className="form-input"
            placeholder="Ask for an audit (e.g. 'How can I save ₹2,000 extra this month?')..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            style={{ backgroundColor: 'var(--ink)', fontSize: '0.875rem' }}
          />
          <Button
            variant="primary"
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            icon={<Send size={15} />}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
