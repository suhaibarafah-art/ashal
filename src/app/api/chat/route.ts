import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🤖 The Sovereign Empire - AI Concierge (Customer Service)
 * Responds to natural language queries regarding tracking and products.
 */
export async function POST(req: Request) {
  try {
    const { message, customerPhone } = await req.json();

    if (!message || message.trim() === '') {
      return NextResponse.json({ reply: 'عذراً طال عمرك، الرسالة فارغة. تفضل، كيف أقدر أخدمك اليوم؟' });
    }

    // Keyword matching for Order Tracking
    if (message.includes('شحنتي') || message.includes('طلبي') || message.includes('تتبع')) {
       // Look up order by phone
       if (!customerPhone) {
          return NextResponse.json({ reply: 'أبشر يا غالي، لكن أحتاج رقم جوالك للبحث عن شحنتك الموقرة في النظام.' });
       }

       const order = await prisma.order.findFirst({
         where: { customerPhone },
         include: { logistics: true }
       });

       if (!order) {
          return NextResponse.json({ reply: 'أعتذر منك، لا يوجد طلب مرتبط بهذا الرقم. هل تأكدت من رقم الجوال المستخدم أثناء إتمام الدفع؟' });
       }

       if (order.logistics) {
          const courier = order.logistics.chosenCourier || 'شركة الشحن الحصرية';
          return NextResponse.json({ reply: `طلبك الكريم رقم #${order.id.slice(-6).toUpperCase()} تم شحنه بواسطة ${courier}، وهو الآن في طريقه إليك. رفاهية الوصول قريبة!` });
       } else {
          return NextResponse.json({ reply: `طلبك الكريم رقم #${order.id.slice(-6).toUpperCase()} حالياً قيد التجهيز وسيتم تسليمه لشركة الشحن في أقرب وقت. شكراً لاختيارك السيادة.` });
       }
    }

    // Default polite response (AI Fallback)
    return NextResponse.json({ reply: 'أهلاً بك في إمبراطورية السيادة للفخامة. خدمة العملاء الآلية تحت أمرك. يسعدني الإجابة عن أي استفسار يخص طلباتك.' });

  } catch (error) {
    console.error('AI Concierge Error:', error);
    return NextResponse.json({ error: 'عذراً، حدث خطأ في النظام. يتم الآن إصلاحه.' }, { status: 500 });
  }
}
