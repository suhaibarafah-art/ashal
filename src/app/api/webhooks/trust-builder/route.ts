import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🌟 The Sovereign Empire - Auto-Trust Engine (Cron Webhook)
 * This route is called to ask customers for a review 5 days after delivery.
 */
export async function GET(req: Request) {
  try {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    // Look for orders that were 'paid' exactly 5 days ago (roughly)
    const orders = await prisma.order.findMany({
      where: {
         paymentStatus: 'paid',
         // NOTE: In a real app we'd check deliveredAt, using createdAt for demo
         createdAt: {
           lte: fiveDaysAgo
         }
      },
      include: {
        product: true
      }
    });

    let reviewRequestsSent = 0;

    for (const order of orders) {
       // [SIMULATION: Send WhatsApp via API]
       console.log(`[TRUST BUILDER] 📲 Sending WhatsApp to ${order.customerPhone ?? 'Customer'}...
       "طال عمرك، مر 5 أيام على استلامك تحفة (${order.product.titleAr}). 
       يهمنا رأيك جداً، وتصويرك للمنتج يمنحك كود خصم 15% لطلبك القادم عبر الرابط التالي..."`);
       reviewRequestsSent++;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Trust Builder Engine executed.',
      whatsappSent: reviewRequestsSent
    });
  } catch (error) {
    console.error('Trust Engine Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
