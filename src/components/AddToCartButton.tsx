'use client';

/**
 * AddToCartButton — A/B Telemetry-Aware CTA
 * Fires an "add_to_cart" event to /api/ab-track before navigating to checkout.
 * Reads the variant assigned by ProductDescription from sessionStorage.
 */

import { useRouter } from 'next/navigation';

interface AddToCartButtonProps {
  productId: string;
  finalPrice: number;
  /** True when the product is Sohib-V1 (Crimson Petal) — enables A/B tracking */
  isTestProduct: boolean;
}

const SESSION_KEY  = 'sl_sid';
const variantKey   = (pid: string) => `sl_var_${pid}`;

export default function AddToCartButton({
  productId,
  finalPrice,
  isTestProduct,
}: AddToCartButtonProps) {
  const router = useRouter();

  const handleOrder = async () => {
    if (isTestProduct && typeof sessionStorage !== 'undefined') {
      const sessionId = sessionStorage.getItem(SESSION_KEY) || '';
      const variant   = sessionStorage.getItem(variantKey(productId)) || 'unknown';

      // Fire-and-forget: don't block navigation on telemetry
      fetch('/api/ab-track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          productId,
          variantKey: variant,
          event: 'add_to_cart',
        }),
      }).catch(() => {});
    }

    router.push(`/checkout/${productId}`);
  };

  return (
    <button className="btn-primary w-full text-[17px] py-5" onClick={handleOrder}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      اطلب الآن — SAR {finalPrice.toLocaleString('ar-SA')}
    </button>
  );
}
