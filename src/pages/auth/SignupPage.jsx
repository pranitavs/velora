import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { validateEmail, validatePassword } from '../../lib/validators.js';
import { humanizeAuthError } from '../../lib/errors.js';
import BRAND from '../../config/brand.js';
import './auth.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [touched, setTouched] = useState({ email: false, password: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isEmailValid = validateEmail(email);
  const pwdValidation = validatePassword(password);
  const passwordsMatch = password && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!isEmailValid) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!pwdValidation.isValid) {
      setErrorMessage('Please meet all password security requirements.');
      return;
    }
    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signUp({
        email,
        password,
        fullName: fullName.trim()
      });

      if (error) {
        setErrorMessage(humanizeAuthError(error));
        setLoading(false);
        return;
      }

      // Navigate to onboarding flow
      navigate('/onboarding');
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
          <h1 className="auth-title" style={{ marginTop: 12 }}>Create your account</h1>
          <p className="auth-subtitle">Begin your journey to calm financial clarity.</p>
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
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input
              id="fullName"
              type="text"
              required
              placeholder="e.g. Maya Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="form-input"
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              required
              placeholder="name@university.edu or you@work.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
              className={`form-input ${touched.email && !isEmailValid && email ? 'error' : ''}`}
              autoComplete="email"
            />
            {touched.email && email && !isEmailValid && (
              <span className="field-error-message">Please enter a valid email format.</span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="form-input-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                className="form-input"
                autoComplete="new-password"
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

            {/* Live inline hints */}
            <div className="password-hints">
              <div className={`hint-item ${pwdValidation.minLength ? 'valid' : ''}`}>
                <Check size={12} strokeWidth={2} /> Minimum 8 characters
              </div>
              <div className={`hint-item ${pwdValidation.hasUppercase ? 'valid' : ''}`}>
                <Check size={12} strokeWidth={2} /> At least 1 uppercase letter
              </div>
              <div className={`hint-item ${pwdValidation.hasNumber ? 'valid' : ''}`}>
                <Check size={12} strokeWidth={2} /> At least 1 number
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, confirm: true }))}
              className={`form-input ${touched.confirm && confirmPassword && !passwordsMatch ? 'error' : ''}`}
              autoComplete="new-password"
            />
            {touched.confirm && confirmPassword && !passwordsMatch && (
              <span className="field-error-message">Passwords do not match.</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', marginTop: 8 }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 'var(--text-body-sm)', color: 'var(--color-cream-dim)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
