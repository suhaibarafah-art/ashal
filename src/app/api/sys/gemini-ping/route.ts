import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { key } = await req.json();

    if (!key || !key.startsWith("AIza")) {
      return NextResponse.json({ success: false, error: "Invalid API Key format" });
    }

    // Ping Gemini to test the connection exactly as commanded
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "اكتب جملة ترحيبية قصيرة جداً بلهجة سعودية فخمة جداً لمتجر إلكتروني يبيع مقتنيات النخبة. سطر واحد فقط."
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return NextResponse.json({ success: false, error: data.error.message });
    }

    const greeting = data.candidates?.[0]?.content?.parts?.[0]?.text || "فشلت صياغة الترحيب الملكي";

    // Second test: Categories
    const categoriesResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "اكتب 3 عناوين أقسام لمتجر إلكتروني سعودي فخم جداً. مثل (ركن القهوة المبتكر، إضاءة المستقبل)، بدون ترقيم."
          }]
        }]
      })
    });

    const catData = await categoriesResponse.json();
    const categories = catData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({ 
      success: true, 
      greeting,
      categories: categories.split('\n').filter(Boolean)
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
