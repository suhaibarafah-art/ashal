/**
 * The Ultimate Saudi Dropship 2026 - Pricing Engine
 * تطبق المعادلة المطلوبة: (التكلفة + الشحن) * 1.40 * 1.15 مع التقريب الذكي إلى .99
 */

export function calculateLuxuryPrice(cost: number, shipping: number): number {
  // 1. Calculate the base raw profit (applying the specified margins)
  const rawPrice = (cost + shipping) * 1.40 * 1.15;
  
  // 2. Smart rounding: Convert to integer and add 0.99 for psychological luxury pricing
  const roundedPrice = Math.floor(rawPrice) + 0.99;
  
  return roundedPrice;
}
