/**
 * Saudi Luxury Store — Pricing Engine v2
 * Phase 2 mandate: 30% margin + 15% VAT → rounded to nearest .99 SAR
 *
 * Formula: floor((cost + shipping) * 1.30 * 1.15) + 0.99
 * Example: cost=100 ship=20 → floor(179.40) + 0.99 = 179.99 SAR
 */

export interface PricingMetrics {
  demandScore?: number;
  supplierStock?: number;
  recentSalesCount?: number;
}

/** Standard luxury price — 30% margin + 15% VAT + .99 rounding */
export function calculateLuxuryPrice(baseCost: number, shipping: number): number {
  const raw = (baseCost + shipping) * 1.30 * 1.15;
  return Math.floor(raw) + 0.99;
}

/** Dynamic price with optional surge (minimum 30% always) */
export function calculateDynamicPrice(
  baseCost: number,
  shipping: number,
  metrics: PricingMetrics = {}
): number {
  let margin = 1.30;
  if (metrics.demandScore && metrics.demandScore > 0.8) margin += 0.10;
  const hour = new Date().getHours();
  if (hour >= 20 && hour <= 23) margin += 0.05;
  margin = Math.max(margin, 1.30);
  const raw = (baseCost + shipping) * margin * 1.15;
  return Math.floor(raw) + 0.99;
}

/** Apply coupon discount — SAVE10 (10%) | ROYAL20 (20%) */
export function applyCoupon(
  finalPrice: number,
  couponCode: string
): { discountedPrice: number; discountAmount: number } {
  const COUPONS: Record<string, number> = { SAVE10: 0.10, ROYAL20: 0.20 };
  const pct = COUPONS[couponCode.toUpperCase()] ?? 0;
  const discountAmount = Math.round(finalPrice * pct * 100) / 100;
  return {
    discountedPrice: Math.max(0, Math.round((finalPrice - discountAmount) * 100) / 100),
    discountAmount,
  };
}
