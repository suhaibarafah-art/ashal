/**
 * Abandoned Cart Recovery — GET /api/webhooks/abandoned-cart
 * Can be triggered manually from admin; automatic via master cron.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendTelegramAlert } from '@/lib/telegram';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://saudilux.store';

async function sendWhatsApp(phone: string, message: string) {
  const token   = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId || token === 'placeholder') {
    console.log(`[WhatsApp/cart] No token — skipping ${phone}`);
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
    const carts = await prisma.abandonedCart.findMany({ where: { status: 'pending' } });
    const now = new Date();
    let remindersSent = 0, discountsSent = 0;

    for (const cart of carts) {
      const hoursDiff = (now.getTime() - new Date(cart.createdAt).getTime()) / 3_600_000;
      const contact   = cart.phone ?? cart.email ?? 'unknown';

      if (hoursDiff >= 4 && hoursDiff < 24 && !cart.remindedAt) {
        if (cart.phone) {
          await sendWhatsApp(cart.phone,
            `مرحباً! 👋 لاحظنا إنك تركت بعض المنتجات الفاخرة في سلة التسوق.\n\nاكمل طلبك الآن وتمتع بالتوصيل خلال 48 ساعة 🚀\n${SITE_URL}`
          );
        }
        await prisma.abandonedCart.update({ where: { id: cart.id }, data: { remindedAt: now } });
        remindersSent++;
        await prisma.systemLog.create({ data: { level: 'INFO', source: 'webhook/abandoned-cart', message: `4h reminder → ${contact}` } });
      } else if (hoursDiff >= 24 && cart.status === 'pending') {
        if (cart.phone) {
          await sendWhatsApp(cart.phone,
            `هدية خاصة لك! 🎁\n\nكود الخصم الحصري: *SOVEREIGN10*\nخصم 10% على طلبك الآن!\n\nالعرض ينتهي خلال 24 ساعة ⏰\n${SITE_URL}`
          );
        }
        await prisma.abandonedCart.update({
          where: { id: cart.id },
          data: { status: 'discount_sent', discountCode: 'SOVEREIGN10' },
        });
        discountsSent++;
        await prisma.systemLog.create({ data: { level: 'INFO', source: 'webhook/abandoned-cart', message: `24h discount → ${contact}` } });
      }
    }

    if (remindersSent + discountsSent > 0) {
      await sendTelegramAlert('SUCCESS', `🛒 Cart Recovery\n${remindersSent} تذكير + ${discountsSent} كود خصم أُرسلوا`);
    }

    return NextResponse.json({ success: true, stats: { remindersSent, discountsSent } });
  } catch (error) {
    await prisma.systemLog.create({ data: { level: 'ERROR', source: 'webhook/abandoned-cart', message: String(error) } }).catch(() => {});
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
