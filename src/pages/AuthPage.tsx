import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/common/Button.tsx';
import { Input } from '../components/common/Input.tsx';
import { login, signup, getState } from '../lib/storage.js';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (isSignUp && !name.trim()) {
      errs.name = 'Please provide your full name';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      if (isSignUp) {
        signup(name.trim(), email.trim(), password);
        setIsLoading(false);
        navigate('/onboarding');
      } else {
        login(email.trim(), password);
        setIsLoading(false);
        const state = getState();
        if (state.user && state.user.hasCompletedOnboarding) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      }
    }, 400);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}
    >
      {/* Brand header */}
      <Link to="/" className="brand-mark" style={{ marginBottom: '2rem' }}>
        <span className="accent-symbol">◆</span>
        <span>VELORA</span>
      </Link>

      <div
        className="velora-card animate-fade-in"
        style={{
          maxWidth: '440px',
          width: '100%',
          padding: '2.25rem',
          backgroundColor: 'var(--ink-raised)',
        }}
      >
        {/* Toggle Mode */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'var(--ink)',
            padding: '3px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--ink-border)',
            marginBottom: '1.75rem',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrors({});
            }}
            className={`segmented-tab-btn ${!isSignUp ? 'active' : ''}`}
            style={{ width: '100%', textAlign: 'center' }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrors({});
            }}
            className={`segmented-tab-btn ${isSignUp ? 'active' : ''}`}
            style={{ width: '100%', textAlign: 'center' }}
          >
            Create Account
          </button>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}>
            {isSignUp ? 'Establish your ledger' : 'Welcome back to Velora'}
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--cream-dim)', marginTop: '0.25rem' }}>
            {isSignUp
              ? 'Institutional financial tracking for university students and young adults.'
              : 'Sign in to access your ledger, savings velocity, and AI mentor.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Alex Chen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              leftAddon={<User size={16} />}
            />
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="you@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            leftAddon={<Mail size={16} />}
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            leftAddon={<Lock size={16} />}
            rightAddon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--cream-dim)' }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            helperText={isSignUp ? 'Minimum 6 characters.' : undefined}
          />

          <div style={{ marginTop: '1.5rem' }}>
            <Button
              type="submit"
              variant="primary"
              style={{ width: '100%' }}
              isLoading={isLoading}
              icon={<ArrowRight size={16} />}
            >
              {isSignUp ? 'Continue to Onboarding' : 'Access Cockpit'}
            </Button>
          </div>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--ink-border)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--cream-dim)' }}>
            {isSignUp ? 'Already have an active account?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrors({});
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent)',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              {isSignUp ? 'Sign in' : 'Create one now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
