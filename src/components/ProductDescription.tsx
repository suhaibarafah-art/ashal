'use client';

/**
 * ProductDescription — A/B Copy Testing Engine
 * Summer Wedding Season 2026 · Sohib-V1 (Crimson Petal)
 *
 * Logic:
 *  1. On mount, reads or assigns a variant from sessionStorage (one variant per session).
 *  2. Fires a "view" telemetry event to /api/ab-track (deduplicated server-side).
 *  3. Renders the assigned copy variant for Crimson Petal; falls back to DB description otherwise.
 */

import { useEffect, useRef, useState } from 'react';
import { CRIMSON_PETAL_VARIANTS, VariantKey } from '@/lib/ab-variants';

interface ProductDescriptionProps {
  productId: string;
  defaultDesc: string;
  /** Pass true when the product is Sohib-V1 (Crimson Petal) */
  isTestProduct: boolean;
}

const SESSION_KEY   = 'sl_sid';
const variantKey    = (pid: string) => `sl_var_${pid}`;

function getOrCreateSessionId(): string {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

function getOrAssignVariant(productId: string): VariantKey {
  const stored = sessionStorage.getItem(variantKey(productId)) as VariantKey | null;
  if (stored && ['royal', 'modern', 'emotional'].includes(stored)) return stored;

  const assigned = CRIMSON_PETAL_VARIANTS[Math.floor(Math.random() * 3)].key;
  sessionStorage.setItem(variantKey(productId), assigned);
  return assigned;
}

export default function ProductDescription({
  productId,
  defaultDesc,
  isTestProduct,
}: ProductDescriptionProps) {
  const [description, setDescription] = useState<string>(defaultDesc);
  const fired = useRef(false);

  useEffect(() => {
    if (!isTestProduct) return;

    const sessionId   = getOrCreateSessionId();
    const variant     = getOrAssignVariant(productId);
    const variantData = CRIMSON_PETAL_VARIANTS.find(v => v.key === variant);

    if (variantData) setDescription(variantData.description);

    // Fire view event once per session per product
    if (!fired.current) {
      fired.current = true;
      fetch('/api/ab-track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, productId, variantKey: variant, event: 'view' }),
      }).catch(() => { /* telemetry never crashes the page */ });
    }
  }, [productId, isTestProduct]);

  return (
    <p
      className="text-[15px] leading-relaxed"
      style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-cairo)' }}
    >
      {description}
    </p>
  );
}
