import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import BRAND from '../../config/brand.js';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ink)', color: 'var(--color-cream)', padding: '48px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-cream-dim)', textDecoration: 'none', marginBottom: '32px' }}>
          <ArrowLeft size={16} strokeWidth={1.5} /> Back to {BRAND.name}
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Shield size={24} strokeWidth={1.5} color="var(--color-accent)" />
          <span className="ui-label">Legal Information</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '24px' }}>
          Privacy Policy
        </h1>

        <div style={{ background: 'var(--color-ink-raised)', border: '1px solid var(--color-ink-border)', borderRadius: '12px', padding: '32px', lineHeight: '1.7', color: 'var(--color-cream-dim)' }}>
          <p style={{ marginBottom: '16px', color: 'var(--color-cream)', fontWeight: 500 }}>
            Notice: This privacy policy is a placeholder. {BRAND.name} is a student final-year BSc IT project and demonstration personal finance platform.
          </p>
          <p style={{ marginBottom: '16px' }}>
            No commercial production data collection is currently active. User credentials, transactions, and session state created within this environment are isolated to your local instance or your configured Supabase project.
          </p>
          <p style={{ marginBottom: '16px' }}>
            When integrating real financial institutions or deploying commercially, consult a licensed legal professional and data protection counsel to draft GDPR, CCPA, and RBI-compliant data handling agreements.
          </p>
          <p>
            Last revised: October 2025.
          </p>
        </div>
      </div>
    </div>
  );
}
