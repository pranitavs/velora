import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { humanizeAuthError } from '../../lib/errors.js';
import BRAND from '../../config/brand.js';
import './auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signIn({
        email: email.trim(),
        password
      });

      if (error) {
        setErrorMessage(humanizeAuthError(error));
        setLoading(false);
        return;
      }

      // Supabase / Local storage authenticated successfully
      navigate('/app/dashboard');
    } catch (err) {
      setErrorMessage(humanizeAuthError(err));
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <Link to="/" className="auth-back-link">
        <ArrowLeft size={16} strokeWidth={1.5} /> Back
      </Link>

      <div className="auth-card">
        <div className="auth-logo-area">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-cream)' }}>
              {BRAND.name}
            </span>
          </Link>
          <h1 className="auth-title" style={{ marginTop: 12 }}>Welcome back</h1>
          <p className="auth-subtitle">Sign in to your financial cockpit.</p>
        </div>

        {errorMessage && (
          <div className="auth-alert-error" role="alert">
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <AlertCircle size={16} strokeWidth={1.5} style={{ marginTop: 2, flexShrink: 0 }} />
              <div>{errorMessage}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="loginEmail" className="form-label">Email Address</label>
            <input
              id="loginEmail"
              type="email"
              required
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="loginPassword" className="form-label">Password</label>
              <Link to="/reset-password" style={{ fontSize: 'var(--text-caption)', color: 'var(--color-accent)', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>
            <div className="form-input-container">
              <input
                id="loginPassword"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                autoComplete="current-password"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                className="input-icon-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', marginTop: 8 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 'var(--text-body-sm)', color: 'var(--color-cream-dim)' }}>
          Don't have an account yet?{' '}
          <Link to="/signup" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
