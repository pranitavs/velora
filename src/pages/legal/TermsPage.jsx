import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import BRAND from '../../config/brand.js';

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ink)', color: 'var(--color-cream)', padding: '48px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-cream-dim)', textDecoration: 'none', marginBottom: '32px' }}>
          <ArrowLeft size={16} strokeWidth={1.5} /> Back to {BRAND.name}
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <FileText size={24} strokeWidth={1.5} color="var(--color-accent)" />
          <span className="ui-label">Legal Information</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '24px' }}>
          Terms of Use
        </h1>

        <div style={{ background: 'var(--color-ink-raised)', border: '1px solid var(--color-ink-border)', borderRadius: '12px', padding: '32px', lineHeight: '1.7', color: 'var(--color-cream-dim)' }}>
          <p style={{ marginBottom: '16px', color: 'var(--color-cream)', fontWeight: 500 }}>
            Notice: These terms of use are a placeholder. {BRAND.name} is developed as an academic final-year BSc IT software project.
          </p>
          <p style={{ marginBottom: '16px' }}>
            All financial analytics, spending recommendations, AI assistant answers, and trip planning budget calculations are provided for educational and self-management simulation purposes only and do not constitute certified financial or investment advice.
          </p>
          <p style={{ marginBottom: '16px' }}>
            Users are advised to verify all critical tax, budget, and travel cost assessments independently before executing contractual commitments.
          </p>
          <p>
            Last revised: October 2025.
          </p>
        </div>
      </div>
    </div>
  );
}
