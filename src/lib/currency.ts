export function formatPrice(amount: number | string, locale = 'ar'): string {
  const num = Number(amount);
  if (locale === 'ar') return `${num.toFixed(2)} ر.س`;
  return `SAR ${num.toFixed(2)}`;
}
export function discountPercent(original: number, selling: number): number {
  return Math.round(((original - selling) / original) * 100);
}
