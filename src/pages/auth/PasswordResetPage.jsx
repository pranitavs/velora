import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { validateEmail } from '../../lib/validators.js';
import BRAND from '../../config/brand.js';
import './auth.css';

export default function PasswordResetPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      // Security best practice: always show confirmation regardless of whether email exists
      setSubmitted(true);
    } catch {
      // Still show confirmed for security privacy
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <Link to="/login" className="auth-back-link">
        <ArrowLeft size={16} strokeWidth={1.5} /> Back to Sign In
      </Link>

      <div className="auth-card">
        <div className="auth-logo-area">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-cream)' }}>
              {BRAND.name}
            </span>
          </Link>
          <h1 className="auth-title" style={{ marginTop: 12 }}>Reset your password</h1>
          <p className="auth-subtitle">Enter your registered email to receive recovery instructions.</p>
        </div>

        {submitted ? (
          <div className="auth-alert-success" role="status">
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <CheckCircle2 size={18} strokeWidth={1.5} color="var(--color-positive)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Check your inbox.</strong> We've sent a reset link to <span style={{ color: 'var(--color-cream)', fontWeight: 600 }}>{email}</span>. Follow the link in the message to update your credentials.
              </div>
            </div>
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <Link to="/login" className="btn-secondary" style={{ width: '100%', display: 'inline-block' }}>
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {error && (
              <div className="auth-alert-error" role="alert">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="resetEmail" className="form-label">Email Address</label>
              <input
                id="resetEmail"
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', marginTop: 8 }}
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
