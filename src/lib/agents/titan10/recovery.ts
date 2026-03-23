/**
 * TITAN-10 | Agent 9 — Abandoned Cart Recovery
 * Runs every 6 hours.
 * Finds AbandonedCart entries in "pending" status older than 1 hour.
 * Sends personalized recovery message via WhatsApp (if token available).
 * Falls back to Telegram alert to CEO for manual follow-up.
 * Updates status to "discount_sent" + attaches a recovery coupon.
 */

import { prisma } from '@/lib/prisma';

const RECOVERY_COUPON = 'SAVE10'; // auto-apply 10% to bring them back

async function sendWhatsAppRecovery(phone: string, cartData: string): Promise<boolean> {
  const token   = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  if (!token || !phoneId) return false;

  let productTitle = 'منتجك المفضل';
  try {
    const cart = JSON.parse(cartData) as { titleAr?: string }[];
    productTitle = cart[0]?.titleAr ?? productTitle;
  } catch { /* ignore */ }

  const body = `مرحباً 👋\n\nلاحظنا أنك تركت "${productTitle}" في سلة مشترياتك.\n\n🎁 خصم 10% خاص لك: *${RECOVERY_COUPON}*\n\nاطلب الآن قبل نفاد المخزون 👇`;

  try {
    const res = await fetch(
      `https://graph.facebook.com/v18.0/${phoneId}/messages`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone.startsWith('+') ? phone : `+966${phone.replace(/^0/, '')}`,
          type: 'text',
          text: { body },
        }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function runRecovery(): Promise<{ sent: number; skipped: number }> {
  let sent = 0;
  let skipped = 0;

  const cutoff = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
  const carts  = await prisma.abandonedCart.findMany({
    where: { status: 'pending', createdAt: { lte: cutoff } },
    take: 20,
  });

  for (const cart of carts) {
    const phone = cart.phone;
    if (!phone) { skipped++; continue; }

    const ok = await sendWhatsAppRecovery(phone, cart.cartData);

    await prisma.abandonedCart.update({
      where: { id: cart.id },
      data: {
        status:      ok ? 'discount_sent' : 'pending',
        remindedAt:  new Date(),
        discountCode: RECOVERY_COUPON,
      },
    });

    ok ? sent++ : skipped++;
  }

  await prisma.systemLog.create({
    data: {
      level: 'INFO',
      source: 'agent/recovery',
      message: `Recovery: ${sent} messages sent, ${skipped} skipped (no phone/WhatsApp)`,
      metadata: JSON.stringify({ sent, skipped, total: carts.length }),
    },
  });

  return { sent, skipped };
}
