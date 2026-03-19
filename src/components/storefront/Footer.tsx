'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');
  const bt = useTranslations('brand');

  return (
    <footer className="luxury-footer">
      <div className="container" style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2.5rem',
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div className="footer-brand" style={{ marginBottom: '0.5rem' }}>{bt('name')}</div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--black-400)', marginBottom: '1.25rem', lineHeight: 1.7 }}>
              {bt('tagline')}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { label: 'X', href: 'https://twitter.com' },
                { label: 'IG', href: 'https://instagram.com' },
                { label: 'WA', href: 'https://wa.me/966500000000' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    border: '1px solid var(--border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold-500)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'var(--transition-fast)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(184,137,42,0.12)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-500)', marginBottom: '1.25rem' }}>
              {t('shop')}
            </h4>
            <ul className="footer-links" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
              {[
                { href: `/${locale}`, label: locale === 'ar' ? 'الرئيسية' : 'Home' },
                { href: `/${locale}/collections/smart-home`, label: locale === 'ar' ? 'منزل ذكي' : 'Smart Home' },
                { href: `/${locale}/collections/productivity`, label: locale === 'ar' ? 'إنتاجية' : 'Productivity' },
                { href: `/${locale}/collections/car`, label: locale === 'ar' ? 'إكسسوارات السيارة' : 'Car Accessories' },
              ].map(l => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-500)', marginBottom: '1.25rem' }}>
              {t('help')}
            </h4>
            <ul className="footer-links" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
              {[
                { href: `/${locale}/faq`, label: t('faq') },
                { href: `/${locale}/track`, label: locale === 'ar' ? 'تتبع الطلب' : 'Track Order' },
                { href: `/${locale}/contact`, label: t('contact') },
                { href: `/${locale}/about`, label: t('about') },
              ].map(l => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-500)', marginBottom: '1.25rem' }}>
              {t('legal')}
            </h4>
            <ul className="footer-links" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
              {[
                { href: `/${locale}/legal/shipping`, label: t('shipping_policy') },
                { href: `/${locale}/legal/returns`, label: t('returns_policy') },
                { href: `/${locale}/legal/privacy`, label: t('privacy') },
                { href: `/${locale}/legal/terms`, label: t('terms') },
              ].map(l => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            marginTop: '3rem',
            paddingTop: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
          className="footer-bottom"
        >
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--black-500)' }}>
            © {new Date().getFullYear()} {bt('name')} — {t('rights')}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {['مدى', 'Visa', 'MC', 'COD'].map(p => (
              <span
                key={p}
                style={{
                  padding: '0.2rem 0.5rem',
                  background: 'var(--black-800)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--black-300)',
                  fontWeight: 600,
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr !important; }
          .footer-bottom { flex-direction: row !important; }
        }
      `}</style>
    </footer>
  );
}
