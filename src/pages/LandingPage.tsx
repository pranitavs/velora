import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Target,
  Flame,
  Bot,
  Zap,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: 'var(--ink)', minHeight: '100vh', color: 'var(--cream)' }}>
      {/* Fixed Landing Top Nav */}
      <nav className="landing-nav">
        <Link to="/" className="brand-mark">
          <span className="accent-symbol">◆</span>
          <span>VELORA</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/login" className="velora-btn btn-ghost btn-sm">
            Sign In
          </Link>
          <Link to="/signup" className="velora-btn btn-primary btn-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--ink-raised)',
              border: '1px solid var(--ink-border)',
              fontSize: '0.75rem',
              color: 'var(--accent)',
              fontWeight: 600,
              marginBottom: '1.5rem',
              letterSpacing: '0.04em',
            }}
          >
            <span>DISCIPLINED PERSONAL FINANCE FOR YOUNG ADULTS</span>
          </div>

          <h1 className="hero-headline">
            Your money, <br />
            <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>finally understood.</span>
          </h1>

          <p className="hero-subtitle">
            An institutional-grade money cockpit for university students and young professionals.
            Track cashflow margins, simulate savings targets, maintain daily check-in streaks, and consult an unsparing AI financial analyst.
          </p>

          <div className="hero-actions">
            <Link to="/signup" className="velora-btn btn-primary" style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem' }}>
              <span>Open Your Ledger</span>
              <ArrowRight size={17} />
            </Link>
            <Link to="/dashboard" className="velora-btn btn-secondary" style={{ padding: '0.75rem 1.4rem' }}>
              <span>View Interactive Demo</span>
            </Link>
          </div>

          <div
            className="meta-unboxed-row"
            style={{ marginTop: '2.5rem', color: 'var(--cream-dim)' }}
          >
            <span>100% Local-First Storage</span>
            <span className="meta-dot-sep">·</span>
            <span>Zero Data Telemetry</span>
            <span className="meta-dot-sep">·</span>
            <span>INR ₹ / USD $ Native</span>
          </div>
        </div>

        {/* Animated Terminal / Ledger Sample Card */}
        <div className="velora-card card-hover-lift animate-fade-in" style={{ padding: '1.75rem', backgroundColor: 'var(--ink-raised)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--ink-border)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--cream-dim)' }}>
                Terminal Ledger · Live
              </span>
              <h3 style={{ fontSize: '1.125rem', fontFamily: 'var(--font-serif)', color: 'var(--cream)', marginTop: '0.15rem' }}>
                Academic Year Cashflow
              </h3>
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                color: 'var(--positive)',
                backgroundColor: 'var(--positive-bg)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
              }}
            >
              <TrendingUp size={13} />
              <span>+34.2% Saved</span>
            </div>
          </div>

          {/* Metric mini row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '0.85rem', background: 'var(--ink)', borderRadius: 'var(--radius-md)', border: '1px solid var(--ink-border)' }}>
              <p style={{ fontSize: '0.6875rem', color: 'var(--cream-dim)', textTransform: 'uppercase' }}>Net Capital</p>
              <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--cream)', marginTop: '0.2rem' }}>₹48,250.00</p>
            </div>
            <div style={{ padding: '0.85rem', background: 'var(--ink)', borderRadius: 'var(--radius-md)', border: '1px solid var(--ink-border)' }}>
              <p style={{ fontSize: '0.6875rem', color: 'var(--cream-dim)', textTransform: 'uppercase' }}>Active Streak</p>
              <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--accent)', marginTop: '0.2rem' }}>12 Days</p>
            </div>
          </div>

          {/* Sample Ledger Lines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--ink)', border: '1px solid var(--ink-border)' }}>
              <div>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--cream)' }}>Research Assistant Stipend</p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--cream-dim)' }}>UPI · Oct 14 · Education</p>
              </div>
              <span style={{ color: 'var(--positive)', fontWeight: 600, fontSize: '0.875rem' }}>+₹25,000.00</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--ink)', border: '1px solid var(--ink-border)' }}>
              <div>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--cream)' }}>Hostel Wi-Fi & Electricity</p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--cream-dim)' }}>UPI · Oct 12 · Bills</p>
              </div>
              <span style={{ color: 'var(--negative)', fontWeight: 600, fontSize: '0.875rem' }}>-₹950.00</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--ink)', border: '1px solid var(--ink-border)' }}>
              <div>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--cream)' }}>MacBook Pro Savings Allocation</p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--cream-dim)' }}>Goal Transfer · Target 62%</p>
              </div>
              <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.875rem' }}>Allocated</span>
            </div>
          </div>
        </div>
      </header>

      {/* Asymmetric Editorial Feature Sections */}
      <section className="feature-strip">
        <div className="feature-container">
          <div style={{ marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', fontWeight: 600 }}>
              Engineered For Financial Autonomy
            </span>
            <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', marginTop: '0.5rem' }}>
              Built like a ledger. Refined like a publication.
            </h2>
          </div>

          <div className="feature-grid-asym">
            {/* Feature 1 */}
            <div className="velora-card card-hover-lift" style={{ padding: '2rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', marginBottom: '1.25rem' }}>
                <Flame size={22} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-serif)', marginBottom: '0.75rem' }}>
                90-Day Discipline Matrix
              </h3>
              <p style={{ color: 'var(--cream-dim)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                Financial stability is a daily practice. Track streaks like code commits on an interactive 90-day activity matrix. Complete three daily rituals to keep your momentum alive.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="velora-card card-hover-lift" style={{ padding: '2rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--positive-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--positive)', marginBottom: '1.25rem' }}>
                <Target size={22} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-serif)', marginBottom: '0.75rem' }}>
                Contribution Simulator
              </h3>
              <p style={{ color: 'var(--cream-dim)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                Never guess how long a laptop, security deposit, or semester fund will take. Test "What-If" contribution scenarios to simulate accelerated finish lines in real-time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="velora-card card-hover-lift" style={{ padding: '2rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(232, 168, 56, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)', marginBottom: '1.25rem' }}>
                <Bot size={22} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-serif)', marginBottom: '0.75rem' }}>
                Terminal AI Mentor
              </h3>
              <p style={{ color: 'var(--cream-dim)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                Powered by Gemini 3.8 and connected straight to your actual ledger. No sugarcoating or vague advice: receive hard data audits, runway projections, and spending caps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proof & Principles Section */}
      <section className="feature-strip" style={{ backgroundColor: 'var(--ink-raised)' }}>
        <div className="feature-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', fontWeight: 600 }}>
              The Velora Standard
            </span>
            <h2 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-serif)', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
              Why students replace spreadsheet chaos with VELORA
            </h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--positive)', marginTop: '3px', flexShrink: 0 }} />
                <span style={{ color: 'var(--cream-dim)', fontSize: '0.875rem' }}>
                  <strong style={{ color: 'var(--cream)' }}>Zero Corporate Pill Clutter:</strong> Clean editorial layout designed for rapid data scanning, clear visual hierarchy, and instant cashflow truth.
                </span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--positive)', marginTop: '3px', flexShrink: 0 }} />
                <span style={{ color: 'var(--cream-dim)', fontSize: '0.875rem' }}>
                  <strong style={{ color: 'var(--cream)' }}>Local Data Sovereignty:</strong> Your financial data stays entirely on your device in structured localStorage. Export to CSV anytime with zero lock-in.
                </span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--positive)', marginTop: '3px', flexShrink: 0 }} />
                <span style={{ color: 'var(--cream-dim)', fontSize: '0.875rem' }}>
                  <strong style={{ color: 'var(--cream)' }}>Student-First Categories:</strong> Preconfigured for campus realities: hostels, transit passes, textbooks, chai, peer tutoring, and freelance stipends.
                </span>
              </li>
            </ul>

            <div style={{ marginTop: '2rem' }}>
              <Link to="/signup" className="velora-btn btn-primary">
                <span>Start Your Financial Journey</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--ink)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--ink-border)' }}>
            <p style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--cream)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              "Before Velora, my research stipend vanished every month between hostel rent and food delivery without me noticing. The 90-day matrix and terminal insights gave me the discipline to save ₹30,000 for graduation."
            </p>
            <div className="meta-unboxed-row">
              <strong style={{ color: 'var(--cream)' }}>Priya Sharma</strong>
              <span className="meta-dot-sep">·</span>
              <span>Computer Science Undergraduate</span>
              <span className="meta-dot-sep">·</span>
              <span style={{ color: 'var(--accent)' }}>28-Day Active Streak</span>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Newspaper-Style Footer */}
      <footer style={{ padding: '3.5rem 2rem', borderTop: '1px solid var(--ink-border)', backgroundColor: 'var(--ink)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="brand-mark" style={{ fontSize: '1.25rem' }}>
              <span className="accent-symbol">◆</span>
              <span>VELORA</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--cream-dim)', marginTop: '0.35rem' }}>
              Personal Finance Terminal for the next generation of builders.
            </p>
          </div>

          <div className="meta-unboxed-row" style={{ fontSize: '0.8125rem' }}>
            <Link to="/dashboard" style={{ color: 'var(--cream-dim)' }}>Cockpit</Link>
            <span className="meta-dot-sep">·</span>
            <Link to="/transactions" style={{ color: 'var(--cream-dim)' }}>Ledger</Link>
            <span className="meta-dot-sep">·</span>
            <Link to="/streaks" style={{ color: 'var(--cream-dim)' }}>Streaks</Link>
            <span className="meta-dot-sep">·</span>
            <Link to="/assistant" style={{ color: 'var(--cream-dim)' }}>AI Mentor</Link>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--cream-subtle)' }}>
            © {new Date().getFullYear()} VELORA. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
