/**
 * The Ultimate Saudi Dropship 2026 - Pricing Engine
 * تطبق المعادلة المطلوبة: (التكلفة + الشحن) * 1.40 * 1.15 مع التقريب الذكي إلى .99
 */

// Phase 2: Updated to 30% margin + 15% VAT
export function calculateLuxuryPrice(cost: number, shipping: number): number {
  const rawPrice = (cost + shipping) * 1.30 * 1.15;
  return Math.floor(rawPrice) + 0.99;
}
