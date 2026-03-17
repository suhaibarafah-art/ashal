/**
 * Saudi Luxury Store - Autonomous Social Proof
 * أتمتة إثبات الموثوقية - جلب التقييمات وتوطينها باللهجة السعودية.
 */

export interface RawReview {
  author: string;
  rating: number;
  text: string;
}

export function localizeReview(review: RawReview): string {
  // Simulate Gemini-driven localization to Saudi dialect
  const localPhrases = [
    "والله القطعة تجنن وتوصلت بسرعة",
    "فخامة لا توصف، أنصح فيها وبقوة",
    "تعامل راقي وسرعة في التوصيل، شكراً لكم",
    "الجودة فوق الخيال.. تستاهل كل ريال"
  ];

  const randomPhrase = localPhrases[Math.floor(Math.random() * localPhrases.length)];
  
  return `${randomPhrase} (تقييم: ${review.rating}/5)`;
}

export async function fetchLocalizedReviews(productId: string) {
  // Mock fetching from supplier and localizing
  const mockReviews: RawReview[] = [
    { author: "User123", rating: 5, text: "Great product, fast shipping." }
  ];

  return mockReviews.map(localizeReview);
}
