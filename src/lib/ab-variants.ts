/**
 * A/B Copywriting Variants — Sohib-V1 (Crimson Petal) · Summer Wedding Season 2026
 * Three distinct emotional registers to test which copy drives the most Add to Cart events.
 * Rotation: one variant per browser session (persisted in sessionStorage).
 */

export type VariantKey = 'royal' | 'modern' | 'emotional';

export interface ABVariant {
  key: VariantKey;
  labelAr: string;
  labelEn: string;
  description: string;
}

/**
 * The three Crimson Petal copy variants.
 * Injected into ProductDescription on the product page.
 */
export const CRIMSON_PETAL_VARIANTS: ABVariant[] = [
  {
    key: 'royal',
    labelAr: 'ملكي',
    labelEn: 'Royal',
    description:
      'تُجسّد عباءة "بتلة القرمزي" أرقى ما أنتجته دور الأزياء الخليجية — ' +
      'نُسجت من أجود أقمشة الحرير المُطعّمة بخيوط ذهبية، تصميم لمَن تعتبر الأناقة ' +
      'هوية لا مجرد خيار. لتحوّل كل مناسبة إلى لحظة خالدة يتذكرها الجميع.',
  },
  {
    key: 'modern',
    labelAr: 'عصري',
    labelEn: 'Modern',
    description:
      'عباءة "بتلة القرمزي" — حيث التصميم المعاصر يلتقي بالتراث السعودي الأصيل. ' +
      'قصّة تشكيلية نقية، ألوان حرارية تُضيء الحضور، وراحة لا تتنازل عن الجمال. ' +
      'مثالية لحفلات الأعراس الصيفية وسهرات الغالا الفاخرة.',
  },
  {
    key: 'emotional',
    labelAr: 'عاطفي',
    labelEn: 'Emotional',
    description:
      'في اللحظات التي تستحق أن تُحفر في الذاكرة... ارتدي "بتلة القرمزي". ' +
      'لأن كل نظرة إليكِ ستكون قصيدة، وكل خطوة ستكون لحظة لا تُنسى. ' +
      'هدية لنفسكِ في أجمل ليالي حياتكِ.',
  },
];

/**
 * Returns a variant index (0 | 1 | 2) deterministically from a session ID string.
 * Used server-side if needed; client uses Math.random() for first-assignment.
 */
export function variantIndexFromSession(sessionId: string): number {
  let hash = 5381;
  for (let i = 0; i < sessionId.length; i++) {
    hash = (hash * 33) ^ sessionId.charCodeAt(i);
  }
  return Math.abs(hash) % CRIMSON_PETAL_VARIANTS.length;
}

/**
 * Determine if a product title qualifies for Crimson Petal A/B testing.
 * Matches the specific product name (case-insensitive, Arabic or English).
 */
export function isCrimsonPetalProduct(titleEn: string, titleAr: string): boolean {
  const en = titleEn.toLowerCase();
  const ar = titleAr;
  return (
    en.includes('crimson petal') ||
    en.includes('sohib') ||
    ar.includes('بتلة القرمزي') ||
    ar.includes('صهيب')
  );
}
