'use client';

/**
 * /checkout/callback
 * Universal callback for Tabby / Tamara after payment approval.
 * Query params: provider, status, orderId
 */

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const provider = searchParams.get('provider') ?? '';
    const status   = searchParams.get('status') ?? '';
    const orderId  = searchParams.get('orderId') ?? '';

    const approved = ['authorized', 'approved'].includes(status);

    if (!orderId) { router.push('/'); return; }

    if (approved) {
      fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, provider, status }),
      }).finally(() => {
        router.push(`/orders/${orderId}`);
      });
    } else {
      // canceled or rejected
      router.push(`/orders/${orderId}?payment=failed`);
    }
  }, [router, searchParams]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      alignItems: 'center', minHeight: '100vh', background: 'var(--bg-primary)',
      gap: '16px',
    }}>
      <div style={{ fontSize: '48px' }}>⏳</div>
      <p style={{
        fontFamily: 'var(--font-cairo)', color: 'var(--text-secondary)',
        fontSize: '16px', fontWeight: 700,
      }}>
        جارٍ التحقق من عملية الدفع...
      </p>
      <p style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--text-muted)', fontSize: '12px' }}>
        Please wait
      </p>
    </div>
  );
}

export default function CheckoutCallback() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <p style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-muted)' }}>جارٍ التحميل...</p>
      </div>
    }>
      <CallbackInner />
    </Suspense>
  );
}
