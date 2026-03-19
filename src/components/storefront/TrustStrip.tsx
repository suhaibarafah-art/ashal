'use client';

import { useTranslations } from 'next-intl';
import { Truck, RefreshCw, Shield, Headphones } from 'lucide-react';

export default function TrustStrip() {
  const t = useTranslations('trust');

  const items = [
    { icon: Truck, label: t('shipping'), detail: t('shipping_detail') },
    { icon: RefreshCw, label: t('returns'), detail: t('returns_detail') },
    { icon: Shield, label: t('payment'), detail: t('payment_detail') },
    { icon: Headphones, label: t('support'), detail: t('support_detail') },
  ];

  return (
    <div className="trust-strip">
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem',
          }}
          className="trust-strip-grid"
        >
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="trust-strip__item">
                <div className="trust-strip__icon">
                  <Icon size={16} />
                </div>
                <div>
                  <span className="trust-strip__label">{item.label}</span>
                  <span className="trust-strip__detail">{item.detail}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .trust-strip-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
