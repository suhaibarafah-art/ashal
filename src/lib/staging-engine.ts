/**
 * Saudi Luxury Store - AI Staging Engine
 * محرك الصور الحية - يختار خلفيات المنتجات بناءً على المناسبات والمواسم السعودية.
 */

export function getDynamicBackground(productType: string): string {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const day = now.getDate();

  // 1. Ramadan / Eid Simulation (Approximate for demo)
  // In production, use a Hijri library
  if (month === 2) { // March 2026 approx
    return "/assets/staging/ramadan-luxury.jpg";
  }

  // 2. Winter in Riyadh (Dec, Jan, Feb)
  if (month === 11 || month === 0 || month === 1) {
    return "/assets/staging/riyadh-winter-majlis.jpg";
  }

  // 3. National Day (Sept 23)
  if (month === 8 && day === 23) {
    return "/assets/staging/saudi-national-day.jpg";
  }

  // Default Luxury Staging
  return "/assets/staging/minimal-matte-black.jpg";
}
