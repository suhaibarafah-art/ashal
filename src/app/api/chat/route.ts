import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { simulateSaudiAiResponse } from "@/lib/ai-simulation";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!genAI || !apiKey) {
      const simulatedReply = await simulateSaudiAiResponse(message);
      return NextResponse.json({ reply: simulatedReply });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      أنت مساعد شخصي ذكي في متجر "الفخامة" (Saudi Luxury Store). 
      تتحدث بلهجة سعودية "بيضاء" (راقية، مهذبة، وفخمة). 
      تخاطب العميل بتقدير (يا هلا، طال عمرك، يا فندم، قائد العمليات، إلخ).
      هدفنا هو تقديم تجربة تسوق نخبوية. 
      إذا سألك العميل عن اقتراحات، اقترح له منتجات فخمة (مثل أبجورات كريستال، مباخر ذكية، ساعات فخمة).

      المستخدم يقول: "${message}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    const fallbackReply = await simulateSaudiAiResponse("");
    return NextResponse.json({ reply: fallbackReply });
  }
}
