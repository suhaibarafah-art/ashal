/**
 * Trust Builder — GET /api/webhooks/trust-builder
 * Sends review request WhatsApp 5 days after order ships.
 * Can be triggered manually; also called by master cron.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendTelegramAlert } from '@/lib/telegram';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://saudilux.store';

async function sendWhatsApp(phone: string, message: string) {
  const token   = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId || token === 'placeholder') {
    console.log(`[WhatsApp/trust] No token — skipping ${phone}`);
    return;
  }
  const intl = phone.replace(/\D/g, '').replace(/^0/, '966');
  await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to: intl, type: 'text', text: { body: message } }),
  }).catch(console.error);
}

export async function GET() {
  try {
    const fiveDaysAgo  = new Date(Date.now() - 5 * 86_400_000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 86_400_000);

    // Catch the 5-7 day window to avoid re-sending
    const orders = await prisma.order.findMany({
      where: {
        paymentStatus: { in: ['SHIPPED', 'DELIVERED', 'PAID_AND_ORDERED'] },
        createdAt: { lte: fiveDaysAgo, gte: sevenDaysAgo },
      },
      include: { product: { select: { titleAr: true } } },
    });

    let requestsSent = 0;

    for (const order of orders) {
      if (!order.customerPhone) continue;

      await sendWhatsApp(
        order.customerPhone,
        `طال عمرك ${order.customerName ?? ''}! 🌟\n\n` +
        `مر 5 أيام على طلبك *${order.product.titleAr}*.\n\n` +
        `يهمنا رأيك — صوّر المنتج وأرسله لنا وتحصل على كود خصم 15% على طلبك القادم 🎁\n\n` +
        `تابع طلبك: ${SITE_URL}/orders/${order.id}`
      );

      await prisma.systemLog.create({
        data: { level: 'INFO', source: 'webhook/trust-builder', message: `Review request → ${order.customerPhone} — ${order.product.titleAr}` },
      });
      requestsSent++;
    }

    if (requestsSent > 0) {
      await sendTelegramAlert('SUCCESS', `⭐ Trust Builder\n${requestsSent} طلب تقييم أُرسل للعملاء`);
    }

    return NextResponse.json({ success: true, requestsSent });
  } catch (error) {
    await prisma.systemLog.create({ data: { level: 'ERROR', source: 'webhook/trust-builder', message: String(error) } }).catch(() => {});
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
