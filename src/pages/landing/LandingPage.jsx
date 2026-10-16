import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, ArrowRight, ShieldCheck, Flame, Compass, TrendingUp } from 'lucide-react';
import BRAND from '../../config/brand.js';
import './landing.css';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Animation refs
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const copyRef = useRef(null);
  const buttonsRef = useRef(null);
  const summaryCardRef = useRef(null);
  const countBalanceRef = useRef(null);
  const countIncomeRef = useRef(null);
  const countExpenseRef = useRef(null);
  const storytellingRef = useRef(null);
  const goalFillRef = useRef(null);
  const habitGridRef = useRef(null);

  useEffect(() => {
    // Scroll listener for nav shrink
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // GSAP Hero Entrance Animation
    const ctx = gsap.context(() => {
      // Headline words stagger
      if (headlineRef.current) {
        gsap.from(headlineRef.current.querySelectorAll('.word'), {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out'
        });
      }

      // Subtext fade in
      if (copyRef.current) {
        gsap.from(copyRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          delay: 0.3,
          ease: 'power3.out'
        });
      }

      // Buttons fade in
      if (buttonsRef.current) {
        gsap.from(buttonsRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          delay: 0.5,
          ease: 'power3.out'
        });
      }

      // Financial Card slide in
      if (summaryCardRef.current) {
        gsap.from(summaryCardRef.current, {
          x: 60,
          opacity: 0,
          duration: 1,
          delay: 0.6,
          ease: 'power3.out'
        });
      }

      // Number count-up simulation on summary card
      const numObj = { balance: 0, income: 0, expense: 0 };
      gsap.to(numObj, {
        balance: 42850,
        income: 65000,
        expense: 22150,
        duration: 1.6,
        delay: 0.7,
        ease: 'power2.out',
        onUpdate: () => {
          if (countBalanceRef.current) {
            countBalanceRef.current.innerHTML = `<span style="font-family: var(--font-body), sans-serif; margin-right: 2px;">₹</span>${Math.round(numObj.balance).toLocaleString('en-IN')}`;
          }
          if (countIncomeRef.current) {
            countIncomeRef.current.innerHTML = `<span style="font-family: var(--font-body), sans-serif;">₹</span>${Math.round(numObj.income).toLocaleString('en-IN')}`;
          }
          if (countExpenseRef.current) {
            countExpenseRef.current.innerHTML = `<span style="font-family: var(--font-body), sans-serif;">₹</span>${Math.round(numObj.expense).toLocaleString('en-IN')}`;
          }
        }
      });

      // Goal progress bar scroll reveal
      if (goalFillRef.current) {
        gsap.fromTo(
          goalFillRef.current,
          { width: '0%' },
          {
            width: '68%',
            scrollTrigger: {
              trigger: goalFillRef.current,
              start: 'top 85%',
              end: 'top 45%',
              scrub: 1
            }
          }
        );
      }

      // Habit squares reveal
      if (habitGridRef.current) {
        const squares = habitGridRef.current.querySelectorAll('.activity-sq');
        gsap.from(squares, {
          opacity: 0.2,
          scale: 0.8,
          stagger: 0.015,
          scrollTrigger: {
            trigger: habitGridRef.current,
            start: 'top 80%'
          }
        });
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ctx.revert();
    };
  }, []);

  const scrollToStory = (e) => {
    e.preventDefault();
    storytellingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-wrapper">
      {/* SECTION 1 — NAVIGATION */}
      <nav className={`landing-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="landing-nav-inner">
          <Link to="/" className="landing-logo">
            {BRAND.name}
          </Link>

          <div className="landing-nav-links">
            <a href="#how-it-works" onClick={scrollToStory} className="landing-nav-link">
              How it works
            </a>
            <a href="#features" className="landing-nav-link">
              Features
            </a>
            <Link to="/login" className="btn-ghost">
              Sign in
            </Link>
            <Link to="/signup" className="btn-primary">
              Get started
            </Link>
          </div>

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Fullscreen Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-overlay">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="landing-logo">
            {BRAND.name}
          </Link>
          <a
            href="#how-it-works"
            onClick={(e) => {
              setMobileMenuOpen(false);
              scrollToStory(e);
            }}
            className="landing-nav-link"
          >
            How it works
          </a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="landing-nav-link">
            Features
          </a>
          <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary" style={{ width: '220px' }}>
            Sign in
          </Link>
          <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="btn-primary" style={{ width: '220px' }}>
            Get started
          </Link>
        </div>
      )}

      {/* SECTION 2 — HERO */}
      <section className="landing-hero" ref={heroRef}>
        <div className="hero-content">
          <h1 className="hero-headline" ref={headlineRef}>
            <span className="word">Your </span>
            <span className="word">money,</span>
            <span className="hero-headline-accent word">{BRAND.tagline.replace('Your money, ', '')}</span>
          </h1>

          <p className="hero-copy" ref={copyRef}>
            A financial companion that builds habits, answers questions, and brings clarity.
          </p>

          <div className="hero-actions" ref={buttonsRef}>
            <Link to="/signup" className="btn-primary">
              Start for free <ArrowRight size={16} strokeWidth={1.5} style={{ marginLeft: 8 }} />
            </Link>
            <button type="button" onClick={scrollToStory} className="btn-ghost">
              See how it works
            </button>
          </div>
        </div>

        {/* Right side animated financial card */}
        <div className="hero-card-col">
          <div className="financial-summary-card" ref={summaryCardRef}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span className="ui-label">October Financial Overview</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-positive)', fontWeight: 600 }}>Active</span>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)', marginBottom: 4 }}>
                Available Balance
              </div>
              <div
                ref={countBalanceRef}
                className="tabular-nums"
                style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', color: 'var(--color-cream)' }}
              >
                ₹0
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ background: 'var(--color-ink)', padding: 12, borderRadius: 8, border: '1px solid var(--color-ink-border)' }}>
                <span className="ui-label" style={{ display: 'block', marginBottom: 2 }}>Monthly Income</span>
                <span ref={countIncomeRef} className="tabular-nums" style={{ color: 'var(--color-positive)', fontWeight: 600 }}>
                  ₹0
                </span>
              </div>
              <div style={{ background: 'var(--color-ink)', padding: 12, borderRadius: 8, border: '1px solid var(--color-ink-border)' }}>
                <span className="ui-label" style={{ display: 'block', marginBottom: 2 }}>Expenses</span>
                <span ref={countExpenseRef} className="tabular-nums" style={{ color: 'var(--color-negative)', fontWeight: 600 }}>
                  ₹0
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', color: 'var(--color-cream-dim)' }}>
              <span>Savings Rate</span>
              <span className="tabular-nums" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>65.9%</span>
            </div>

            <div className="card-sample-tag">Sample data</div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — SCROLL STORYTELLING */}
      <section id="how-it-works" className="landing-storytelling" ref={storytellingRef}>
        <div className="story-pin-container">
          {/* Chapter 1: Transactions */}
          <div className="story-chapter">
            <span className="ui-label">Chapter 01</span>
            <h2 className="story-chapter-title">Transactions, finally organized.</h2>
            <p style={{ color: 'var(--color-cream-dim)', maxWidth: '580px' }}>
              Every rupee categorized with precision. Clear breakdowns without confusing tags or manual spreadsheets.
            </p>

            <div className="story-tx-list">
              <div className="story-tx-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-chart-2)' }}></div>
                  <div>
                    <div style={{ fontWeight: 500 }}>Monthly Stipend / Salary</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-cream-dim)' }}>Bank Transfer • Oct 01</div>
                  </div>
                </div>
                <div className="tabular-nums" style={{ color: 'var(--color-positive)', fontWeight: 600 }}>+₹65,000.00</div>
              </div>

              <div className="story-tx-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-chart-4)' }}></div>
                  <div>
                    <div style={{ fontWeight: 500 }}>Apartment Rent</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-cream-dim)' }}>UPI • Oct 02</div>
                  </div>
                </div>
                <div className="tabular-nums" style={{ color: 'var(--color-negative)', fontWeight: 600 }}>-₹14,000.00</div>
              </div>

              <div className="story-tx-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-chart-1)' }}></div>
                  <div>
                    <div style={{ fontWeight: 500 }}>Groceries & Food Supplies</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-cream-dim)' }}>Card • Oct 08</div>
                  </div>
                </div>
                <div className="tabular-nums" style={{ color: 'var(--color-negative)', fontWeight: 600 }}>-₹3,240.00</div>
              </div>
            </div>
          </div>

          {/* Chapter 2: Goals */}
          <div className="story-chapter">
            <span className="ui-label">Chapter 02</span>
            <h2 className="story-chapter-title">Goals that don't give up on you.</h2>
            <p style={{ color: 'var(--color-cream-dim)', maxWidth: '580px' }}>
              Set a target date, test monthly amounts, and let VELORA compute the exact monthly pace required.
            </p>

            <div style={{ marginTop: 24, padding: 20, background: 'var(--color-ink)', borderRadius: 12, border: '1px solid var(--color-ink-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>Emergency Reserve Fund</span>
                <span className="tabular-nums" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>68%</span>
              </div>

              <div className="story-goal-bar-bg">
                <div className="story-goal-bar-fill" ref={goalFillRef} style={{ width: '68%' }}></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--color-cream-dim)', marginTop: 8 }}>
                <span className="tabular-nums">₹34,000 of ₹50,000</span>
                <span>84 days remaining • ₹5,334 / month required</span>
              </div>
            </div>
          </div>

          {/* Chapter 3: AI Assistant */}
          <div className="story-chapter">
            <span className="ui-label">Chapter 03</span>
            <h2 className="story-chapter-title">Ask anything about your money.</h2>
            <p style={{ color: 'var(--color-cream-dim)', maxWidth: '580px' }}>
              No generic chatbot. Grounded in your actual aggregated transactions and spending habits.
            </p>

            <div className="story-chat-messages">
              <div className="story-bubble-user">
                How much did I spend on food this month?
              </div>
              <div className="story-bubble-ai">
                You spent <strong style={{ color: 'var(--color-cream)' }}>₹3,240 across 18 transactions</strong>. That represents 14.6% of your monthly expenditure and is comfortably within your ₹5,000 food budget.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — FEATURE GRID (Editorial Magazine Layout) */}
      <section id="features" className="landing-features">
        <div style={{ marginBottom: 40 }}>
          <span className="ui-label">Precision Architecture</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display)', marginTop: 8 }}>
            Engineered for financial composure.
          </h2>
        </div>

        <div className="features-grid">
          {/* Large Left Feature (60%) */}
          <div className="feature-large">
            <div>
              <span className="ui-label">Daily Accountability</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', margin: '16px 0 12px' }}>
                Daily Habit & Streak Engine
              </h3>
              <p style={{ color: 'var(--color-cream-dim)', lineHeight: 1.6, maxWidth: 440 }}>
                Building wealth is an everyday ritual. Log one transaction or review your budget daily to keep your momentum alive. Consecutive calendar days matter.
              </p>
            </div>

            <div style={{ marginTop: 32, display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <span className="tabular-nums" style={{ fontFamily: 'var(--font-display)', fontSize: '5rem', color: 'var(--color-accent)', lineHeight: 1 }}>
                47
              </span>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--color-cream)' }}>Days Consistent</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-cream-dim)' }}>Longest streak this semester</div>
              </div>
            </div>
          </div>

          {/* Stacked Right Features */}
          <div className="features-right-stack">
            <div className="feature-small">
              <span className="ui-label">Insights & Trends</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', margin: '12px 0 8px' }}>
                Adaptive Spending Analytics
              </h3>
              <p style={{ color: 'var(--color-cream-dim)', fontSize: '0.875rem', marginBottom: 16 }}>
                Categorical breakdowns, month-over-month comparisons, and savings rate trends plotted with strict tabular precision.
              </p>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="ui-label" style={{ color: 'var(--color-positive)' }}>+14.2% Saved vs Last Month</span>
              </div>
            </div>

            <div className="feature-small">
              <span className="ui-label">Automated Travel Budgets</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', margin: '12px 0 8px' }}>
                AI Trip Budget Architect
              </h3>
              <p style={{ color: 'var(--color-cream-dim)', fontSize: '0.875rem', marginBottom: 12 }}>
                Plan realistic college trips with day-by-day estimates. Convert itineraries directly into achievable savings goals.
              </p>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-accent)' }}>
                Example: Goa weekend getaway (4 days) • ₹12,000 budget
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — DAILY HABIT SECTION */}
      <section className="landing-habit">
        <div className="habit-inner">
          <div>
            <div className="habit-number tabular-nums">47</div>
            <div className="ui-label" style={{ fontSize: '0.875rem', color: 'var(--color-cream)' }}>
              days consistent
            </div>
            <p style={{ color: 'var(--color-cream-dim)', marginTop: 16, lineHeight: 1.6, maxWidth: 360 }}>
              Small, repeated daily check-ins eliminate financial anxiety. Tracking takes less than 30 seconds a day and replaces reactive stress with intentional clarity.
            </p>
          </div>

          <div>
            <div className="ui-label" style={{ marginBottom: 8 }}>Past 12 Months Activity Frequency</div>
            <div className="activity-squares-grid" ref={habitGridRef}>
              {Array.from({ length: 60 }).map((_, i) => {
                const isActive = i > 12 && i % 4 !== 0;
                const isGlow = i % 4 === 0 && i > 20;
                return (
                  <div
                    key={i}
                    className={`activity-sq ${isActive ? 'active' : ''} ${isGlow ? 'glow' : ''}`}
                    title={`Day ${i + 1}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — AI SECTION */}
      <section className="landing-ai">
        <span className="ui-label">Private Financial Intelligence</span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display)', margin: '16px 0' }}>
          Ask anything. Get an honest answer.
        </h2>
        <p style={{ color: 'var(--color-cream-dim)', fontSize: 'var(--text-body-lg)', lineHeight: 1.6, marginBottom: 32 }}>
          VELORA synthesizes your recent transactions and active goals to answer direct questions with zero judgment and strict accuracy.
        </p>
        <Link to="/signup" className="btn-primary">
          Explore AI Assistant
        </Link>
      </section>

      {/* SECTION 7 — TRIP PLANNER SECTION */}
      <section className="landing-trip">
        <div style={{ marginBottom: 32 }}>
          <span className="ui-label">Student & Travel Finance</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-heading-1)', marginTop: 8 }}>
            Plan real trips without breaking your semester budget.
          </h2>
        </div>

        <div className="trip-grid">
          {/* Sample Itinerary Card */}
          <div style={{ background: 'var(--color-ink-raised)', border: '1px solid var(--color-ink-border)', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Goa Coastal Trip</h3>
              <span className="tabular-nums" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>₹12,000 Budget</span>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-cream-dim)', marginBottom: 16 }}>
              4 Days • 2 Travellers • Budget Style
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.875rem' }}>
              <div style={{ padding: 10, background: 'var(--color-ink)', borderRadius: 6, display: 'flex', justifyContent: 'space-between' }}>
                <span>Train / Local Transit</span>
                <span className="tabular-nums">₹3,400</span>
              </div>
              <div style={{ padding: 10, background: 'var(--color-ink)', borderRadius: 6, display: 'flex', justifyContent: 'space-between' }}>
                <span>Hostel Stay (3 Nights)</span>
                <span className="tabular-nums">₹4,200</span>
              </div>
              <div style={{ padding: 10, background: 'var(--color-ink)', borderRadius: 6, display: 'flex', justifyContent: 'space-between' }}>
                <span>Food & Shacks</span>
                <span className="tabular-nums">₹3,000</span>
              </div>
              <div style={{ padding: 10, background: 'var(--color-ink)', borderRadius: 6, display: 'flex', justifyContent: 'space-between' }}>
                <span>Activities & Watersports</span>
                <span className="tabular-nums">₹1,400</span>
              </div>
            </div>

            <div className="card-sample-tag">Sample data</div>
          </div>

          {/* Form preview */}
          <div style={{ background: 'var(--color-ink-raised)', border: '1px solid var(--color-ink-border)', borderRadius: 12, padding: 24 }}>
            <div className="ui-label" style={{ marginBottom: 12 }}>See how it works UI</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="ui-label" style={{ display: 'block', marginBottom: 6 }}>Destination</label>
                <input
                  type="text"
                  disabled
                  defaultValue="Goa, India"
                  style={{ width: '100%', background: 'var(--color-ink)', border: '1px solid var(--color-ink-border)', padding: '10px 14px', borderRadius: 6, color: 'var(--color-cream)' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="ui-label" style={{ display: 'block', marginBottom: 6 }}>Duration</label>
                  <input
                    type="text"
                    disabled
                    defaultValue="4 Days"
                    style={{ width: '100%', background: 'var(--color-ink)', border: '1px solid var(--color-ink-border)', padding: '10px 14px', borderRadius: 6, color: 'var(--color-cream)' }}
                  />
                </div>
                <div>
                  <label className="ui-label" style={{ display: 'block', marginBottom: 6 }}>Target Budget</label>
                  <input
                    type="text"
                    disabled
                    defaultValue="₹12,000"
                    style={{ width: '100%', background: 'var(--color-ink)', border: '1px solid var(--color-ink-border)', padding: '10px 14px', borderRadius: 6, color: 'var(--color-cream)' }}
                  />
                </div>
              </div>
              <Link to="/signup" className="btn-secondary" style={{ marginTop: 8, textAlign: 'center' }}>
                Create Custom Trip Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — FINAL CTA */}
      <section className="landing-cta">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display)', marginBottom: 16 }}>
          Start understanding your money.
        </h2>
        <p style={{ color: 'var(--color-cream-dim)', fontSize: 'var(--text-body-lg)', lineHeight: 1.6, marginBottom: 32 }}>
          Take command of your first salary, student allowance, or savings goals with calm, disciplined software.
        </p>
        <Link to="/signup" className="btn-primary" style={{ padding: '14px 32px' }}>
          Create your free account
        </Link>
      </section>

      {/* SECTION 9 — FOOTER */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div>
            <div className="landing-logo" style={{ marginBottom: 12 }}>
              {BRAND.name}
            </div>
            <p style={{ color: 'var(--color-cream-dim)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: 300 }}>
              {BRAND.tagline}
            </p>
          </div>

          <div>
            <div className="ui-label" style={{ marginBottom: 12 }}>Navigation</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem' }}>
              <a href="#how-it-works" onClick={scrollToStory} className="landing-nav-link" style={{ padding: 0 }}>How it works</a>
              <a href="#features" className="landing-nav-link" style={{ padding: 0 }}>Features</a>
              <Link to="/login" className="landing-nav-link" style={{ padding: 0 }}>Sign in</Link>
              <Link to="/signup" className="landing-nav-link" style={{ padding: 0 }}>Sign up</Link>
            </div>
          </div>

          <div>
            <div className="ui-label" style={{ marginBottom: 12 }}>Legal</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem' }}>
              <Link to="/privacy-policy" className="landing-nav-link" style={{ padding: 0 }}>Privacy Policy</Link>
              <Link to="/terms-of-use" className="landing-nav-link" style={{ padding: 0 }}>Terms of Use</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© {BRAND.foundedYear} {BRAND.name}. {BRAND.projectNotice}</div>
          <div>Editorial Fintech for Young Adults</div>
        </div>
      </footer>
    </div>
  );
}
