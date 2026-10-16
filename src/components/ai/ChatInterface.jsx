import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../ui/Button.jsx';
import { calculateBalance, calculateCategoryTotals } from '../../lib/finance.js';
import BRAND from '../../config/brand.js';

const SUGGESTED_PROMPTS = [
  "How much did I spend this week?",
  "What's my biggest spending category?",
  "Am I on track to reach my emergency fund goal?",
  "How much could I save in 6 months at this rate?"
];

export default function ChatInterface({
  transactions = [],
  goals = [],
  currencySymbol = '₹'
}) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hello. I am ${BRAND.name}'s financial assistant. Ask me anything regarding your transactions, spending habits, or savings targets.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // INTEGRATION_REQUIRED: Google Gemini API key — configure VITE_GEMINI_API_KEY in .env
  const isGeminiConfigured = Boolean(
    import.meta.env.VITE_GEMINI_API_KEY &&
    import.meta.env.VITE_GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
    import.meta.env.VITE_GEMINI_API_KEY !== 'your-gemini-api-key'
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Deterministic calculation for assistant responses based on real user data
  const generateAssistantResponse = async (userQuestion) => {
    const q = userQuestion.toLowerCase();
    const { income, expenses, balance } = calculateBalance(transactions);
    const catTotals = calculateCategoryTotals(transactions, 'expense');
    const topCat = catTotals[0];

    // If Gemini API is configured, call live AI endpoint
    if (isGeminiConfigured) {
      try {
        const res = await fetch('/api/ai-assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userQuestion,
            summary: {
              currencySymbol,
              income,
              expenses,
              balance,
              topCategories: catTotals.slice(0, 5),
              activeGoals: goals.map(g => ({ name: g.name, current: g.current_amount, target: g.target_amount }))
            }
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.reply) return data.reply;
        }
      } catch (err) {
        console.warn('Live AI endpoint call failed, using deterministic data response', err);
      }
    }

    // Deterministic response engine grounded in real user transactions and financial calculations
    if (q.includes('spend') || q.includes('spending') || q.includes('this week') || q.includes('expenses')) {
      if (expenses === 0) {
        return `You have not recorded any expenses yet in your current records. Add your daily expenses to see immediate breakdowns.`;
      }
      return `Based on your recorded transactions, your total expenditure is ${currencySymbol}${expenses.toLocaleString('en-IN')}. ${
        topCat ? `Your highest outflow is in ${topCat.category} (${currencySymbol}${topCat.amount.toLocaleString('en-IN')}, representing ${topCat.percentage}% of all expenses).` : ''
      }`;
    }

    if (q.includes('biggest') || q.includes('category') || q.includes('categories')) {
      if (catTotals.length === 0) {
        return `No categorized expenses exist in your records. Once you log transactions, I'll identify your largest expenditure buckets.`;
      }
      return `Your biggest spending category is ${topCat.category} at ${currencySymbol}${topCat.amount.toLocaleString('en-IN')} (${topCat.percentage}% of total expenses), followed by ${
        catTotals[1] ? `${catTotals[1].category} at ${currencySymbol}${catTotals[1].amount.toLocaleString('en-IN')}.` : 'no other categories yet.'
      }`;
    }

    if (q.includes('goal') || q.includes('track') || q.includes('emergency')) {
      if (goals.length === 0) {
        return `You do not have any active savings goals yet. You can create one on the Savings Goals page to begin tracking.`;
      }
      const primary = goals[0];
      const pct = Math.round(((Number(primary.current_amount) || 0) / (Number(primary.target_amount) || 1)) * 100);
      return `For "${primary.name}", you have accumulated ${currencySymbol}${Number(primary.current_amount || 0).toLocaleString('en-IN')} out of ${currencySymbol}${Number(primary.target_amount || 0).toLocaleString('en-IN')} (${pct}% complete).`;
    }

    if (q.includes('save') || q.includes('6 months') || q.includes('rate')) {
      const netSavings = Math.max(0, income - expenses);
      const projected = netSavings * 6;
      return `At your current monthly savings rate (${currencySymbol}${netSavings.toLocaleString('en-IN')}/mo), you are projected to save approximately ${currencySymbol}${projected.toLocaleString('en-IN')} over the next 6 months.`;
    }

    return `Across your portfolio: Total Inflow is ${currencySymbol}${income.toLocaleString('en-IN')}, Total Outflow is ${currencySymbol}${expenses.toLocaleString('en-IN')}, leaving a net balance of ${currencySymbol}${balance.toLocaleString('en-IN')}. Let me know if you would like deeper insights into a specific category or goal!`;
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setError(null);

    const userMsg = {
      id: 'usr_' + Date.now(),
      role: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const replyText = await generateAssistantResponse(userText);
      const aiMsg = {
        id: 'ai_' + Date.now(),
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setError("I couldn't reach the assistant right now. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 220px)',
        minHeight: '480px',
        background: 'var(--color-ink-raised)',
        border: '1px solid var(--color-ink-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}
    >
      {/* Demo Mode / Active Banner */}
      {!isGeminiConfigured && (
        <div
          style={{
            background: 'rgba(201, 168, 76, 0.1)',
            borderBottom: '1px solid rgba(201, 168, 76, 0.25)',
            padding: '8px 16px',
            fontSize: 'var(--text-caption)',
            color: 'var(--color-cream-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>
            <strong style={{ color: 'var(--color-accent)' }}>Local Intelligence Mode:</strong> Grounded in your real transactions & financial formulas. Connect Gemini API in .env for generative expansion.
          </span>
          <span className="ui-label" style={{ fontSize: '0.625rem' }}>Active</span>
        </div>
      )}

      {/* Messages Scroll Viewport */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start'
              }}
            >
              {!isUser && (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'var(--color-ink)',
                    border: '1px solid var(--color-ink-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-accent)',
                    flexShrink: 0
                  }}
                >
                  <Bot size={18} strokeWidth={1.5} />
                </div>
              )}

              <div
                style={{
                  maxWidth: '75%',
                  background: isUser ? 'var(--color-accent-glow)' : 'var(--color-ink)',
                  border: `1px solid ${isUser ? 'rgba(201, 168, 76, 0.35)' : 'var(--color-ink-border)'}`,
                  borderRadius: isUser ? 'var(--radius-lg) var(--radius-lg) 2px var(--radius-lg)' : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) 2px',
                  padding: '14px 18px',
                  color: 'var(--color-cream)',
                  lineHeight: 1.6,
                  fontSize: 'var(--text-body)'
                }}
              >
                <div>{msg.text}</div>
                <div
                  style={{
                    fontSize: 'var(--text-label)',
                    color: 'var(--color-cream-faint)',
                    marginTop: 6,
                    textAlign: isUser ? 'right' : 'left'
                  }}
                >
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'var(--color-accent)',
                    color: 'var(--color-ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    flexShrink: 0
                  }}
                >
                  U
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--color-ink)',
                border: '1px solid var(--color-ink-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent)'
              }}
            >
              <Bot size={18} strokeWidth={1.5} />
            </div>
            <div
              style={{
                background: 'var(--color-ink)',
                border: '1px solid var(--color-ink-border)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 16px',
                display: 'flex',
                gap: 6
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-cream-dim)', animation: 'spin 1s infinite alternate' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-cream-dim)', animation: 'spin 1s infinite alternate 0.2s' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-cream-dim)', animation: 'spin 1s infinite alternate 0.4s' }} />
            </div>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(217, 96, 74, 0.1)',
              border: '1px solid var(--color-negative)',
              color: 'var(--color-cream)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={16} strokeWidth={1.5} color="var(--color-negative)" />
              <span style={{ fontSize: 'var(--text-body-sm)' }}>{error}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleSend()}>
              <RefreshCw size={14} strokeWidth={1.5} /> Retry
            </Button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts on Empty or Recent */}
      <div
        style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--color-ink-border)',
          background: 'var(--color-ink)',
          display: 'flex',
          gap: 8,
          overflowX: 'auto'
        }}
      >
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => setInput(prompt)}
            style={{
              background: 'var(--color-ink-raised)',
              border: '1px solid var(--color-ink-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-cream-dim)',
              padding: '6px 12px',
              fontSize: 'var(--text-caption)',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent)';
              e.currentTarget.style.color = 'var(--color-cream)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-ink-border)';
              e.currentTarget.style.color = 'var(--color-cream-dim)';
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSend}
        style={{
          padding: '16px 20px',
          background: 'var(--color-ink-deep)',
          borderTop: '1px solid var(--color-ink-border)',
          display: 'flex',
          gap: 12,
          alignItems: 'center'
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your finances, budget, or goals..."
          disabled={loading}
          style={{
            flex: 1,
            background: 'var(--color-ink)',
            border: '1px solid var(--color-ink-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-cream)',
            padding: '12px 16px',
            fontSize: 'var(--text-body)',
            outline: 'none'
          }}
        />
        <Button
          type="submit"
          variant="primary"
          disabled={!input.trim() || loading}
          aria-label="Send query"
        >
          <Send size={18} strokeWidth={1.5} />
        </Button>
      </form>
    </div>
  );
}
