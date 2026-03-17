/**
 * Saudi Luxury Store - Dynamic Pricing Engine
 * محرك الأسعار المرنة - يتحكم في هوامش الربح بناءً على الطلب والمخزون.
 */

export interface PricingMetrics {
  demandScore: number; // 0.0 to 1.0
  supplierStock: number;
  recentSalesCount: number;
}

export function calculateDynamicPrice(baseCost: number, shipping: number, metrics: PricingMetrics): number {
  let margin = 1.40; // MANDATORY Sovereign Guardrail: 40% Minimum

  // 1. Surge Pricing: If demand > 0.8, increase margin by 15% (Sovereign Surge)
  if (metrics.demandScore > 0.8) {
    margin += 0.15;
    console.log("🚀 Sovereign Surge Pricing Active: Increasing margin for elite demand.");
  }

  // 2. Hourly Hype Volatility (Simulating active market pulses)
  const hour = new Date().getHours();
  if (hour >= 20 && hour <= 23) { // Luxury Peak (8 PM - 11 PM)
    margin += 0.05;
    console.log("🌙 Night Hype Multiplier: Peak luxury browsing hours detected.");
  }

  // Ensure margin never drops below 1.40
  margin = Math.max(margin, 1.40);

  const price = (baseCost + shipping) * margin * 1.15 + 0.99;
  return Math.round(price * 100) / 100;
}
