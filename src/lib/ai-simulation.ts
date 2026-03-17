/**
 * The Ultimate Saudi Dropship 2026 - AI Personal Simulator
 * محاكي محلي لشخصية المساعد السعودي الفخم في حال عدم توفر مفتاح API.
 */

const SAUDI_RESPONSES = [
  "يا هلا طال عمرك، أبشر باللي يرضيك. عندنا تشكيلة فخمة تناسب ذوقك.",
  "حياك الله يا فندم.. إذا تبحث عن الفخامة، أنصحك تلقي نظرة على 'مجموعة النخبة' اليوم.",
  "أبشر بالسعد.. طلباتك أوامر. هل حاب أساعدك في اختيار هدية فخمة؟",
  "المتجر تحت أمرك يا قائد.. كل المنتجات المختارة تتبع 'هبّة' المجتمع السعودي الحالية.",
  "يا هلا والله.. ذوقك رفيع يا فندم، وهالمنتج بالذات عليه طلب كبير من المبدعين."
];

export async function simulateSaudiAiResponse(userMessage: string): Promise<string> {
  // Simulate a slight delay for realistic feeling
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (userMessage.includes("سعر") || userMessage.includes("كم")) {
    return "الأسعار عندنا مدروسة بعناية لتناسب القيمة الفخمة اللي بنقدمها لك طال عمرك.";
  }
  
  if (userMessage.includes("توصيل") || userMessage.includes("متى")) {
    return "توصيلنا سريع ومضمون لكل مناطق المملكة، ويهمنا توصلك الشحنة بأفضل حال.";
  }

  // Random Saudi polite response
  return SAUDI_RESPONSES[Math.floor(Math.random() * SAUDI_RESPONSES.length)];
}
