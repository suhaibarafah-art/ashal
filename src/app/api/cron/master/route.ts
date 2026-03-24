/**
 * Master Cron — GET /api/cron/master
 * Called by Vercel cron every 4 hours: 0 *\/4 * * *  (Hobby plan: 1 slot)
 *
 * Hour-based mode (UTC):
 *  06:00 → FULL_PIPELINE
 *          Scout → Critic → Copywriter → Strategist → CEO → Analyst
 *          + Cart Recovery + Trust Builder + Empire Engine + Telegram briefing
 *
 *  00:00, 04:00, 08:00, 12:00, 16:00, 20:00 → SURVEILLANCE
 *          Guardian (stock sync) + OrdersSync (tracking) + Recovery (carts)
 */

import { NextResponse } from 'next/server';
import { runTitan10 }    from '@/lib/agents/titan10';
import { prisma }        from '@/lib/prisma';
import { sendTelegramAlert, alertCritical } from '@/lib/telegram';
import { processOrderAutomation } from '@/lib/order-automation';

export const dynamic = 'force-dynamic';

// ─── 1. Abandoned Cart Recovery ──────────────────────────────────────────────

async function runAbandonedCartRecovery(): Promise<{ remindersSent: number; discountsSent: number }> {
  const carts = await prisma.abandonedCart.findMany({ where: { status: 'pending' } });
  const now = new Date();
  let remindersSent = 0, discountsSent = 0;

  for (const cart of carts) {
    const hoursDiff = (now.getTime() - new Date(cart.createdAt).getTime()) / 3_600_000;
    const contact   = cart.phone ?? cart.email ?? 'unknown';

    if (hoursDiff >= 4 && hoursDiff < 24 && !cart.remindedAt) {
      // First nudge — WhatsApp if phone exists
      if (cart.phone) await sendWhatsAppRecovery(cart.phone, null, 'reminder');
      await prisma.abandonedCart.update({ where: { id: cart.id }, data: { remindedAt: now } });
      remindersSent++;
      await prisma.systemLog.create({ data: { level: 'INFO', source: 'cron/master/cart', message: `4h reminder → ${contact}` } });
    } else if (hoursDiff >= 24 && cart.status === 'pending') {
      if (cart.phone) await sendWhatsAppRecovery(cart.phone, 'SOVEREIGN10', 'discount');
      await prisma.abandonedCart.update({
        where: { id: cart.id },
        data: { status: 'discount_sent', discountCode: 'SOVEREIGN10' },
      });
      discountsSent++;
      await prisma.systemLog.create({ data: { level: 'INFO', source: 'cron/master/cart', message: `24h discount SOVEREIGN10 → ${contact}` } });
    }
  }

  return { remindersSent, discountsSent };
}

// ─── 2. Trust Builder (5-day review request) ─────────────────────────────────

async function runTrustBuilder(): Promise<{ requestsSent: number }> {
  const fiveDaysAgo = new Date(Date.now() - 5 * 86_400_000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 86_400_000);

  // Orders delivered/shipped 5-7 days ago (catch the window, not re-send endlessly)
  const orders = await prisma.order.findMany({
    where: {
      paymentStatus: { in: ['SHIPPED', 'DELIVERED', 'PAID_AND_ORDERED'] },
      createdAt: { lte: fiveDaysAgo, gte: sevenDaysAgo },
    },
    include: { product: { select: { titleAr: true } } },
  });

  let requestsSent = 0;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://saudilux.store';

  for (const order of orders) {
    if (!order.customerPhone) continue;
    await sendWhatsAppText(
      order.customerPhone,
      `طال عمرك ${order.customerName ?? ''}! 🌟\n\nمر 5 أيام على استلامك *${order.product.titleAr}*.\n\nيهمنا رأيك جداً — صوّر المنتج وأرسله لنا وتحصل على كود خصم 15% على طلبك القادم 🎁\n\nتابع طلبك: ${siteUrl}/orders/${order.id}`,
    );
    await prisma.systemLog.create({ data: { level: 'INFO', source: 'cron/master/trust', message: `Review request → ${order.customerPhone} — ${order.product.titleAr}` } });
    requestsSent++;
  }

  return { requestsSent };
}

// ─── 3. Empire Engine (safe dynamic pricing) ─────────────────────────────────

async function runEmpireEngine(): Promise<{ adjustments: number; whiteLabelAlerts: number }> {
  let adjustments = 0, whiteLabelAlerts = 0;

  const products = await prisma.product.findMany({ include: { orders: { select: { id: true } } } });

  for (const product of products) {
    // White-label alert at 100+ orders (realistic threshold vs 500)
    if (product.orders.length >= 100 && product.orders.length % 50 === 0) {
      await sendTelegramAlert('SUCCESS',
        `🏷️ White-Label Radar\n\n📦 ${product.titleAr}\n📊 ${product.orders.length} طلب مكتمل\nحان وقت الطلب بالجملة وطباعة البراند!`
      );
      whiteLabelAlerts++;
    }

    // Safe dynamic pricing: only adjust if margin after change stays ≥ 20%
    const minAllowed = (product.baseCost + product.shippingCost) * 1.20;
    const simulatedCompetitor = product.finalPrice * 0.97; // competitor ~3% cheaper
    const proposed = simulatedCompetitor - 1;

    if (proposed > minAllowed && proposed < product.finalPrice) {
      await prisma.product.update({
        where: { id: product.id },
        data: { finalPrice: parseFloat(proposed.toFixed(2)) },
      });
      await prisma.systemLog.create({ data: { level: 'INFO', source: 'cron/master/empire', message: `Price adjusted ${product.titleEn}: ${product.finalPrice.toFixed(2)} → ${proposed.toFixed(2)} SAR` } });
      adjustments++;
    }
  }

  return { adjustments, whiteLabelAlerts };
}

// ─── 0. Order Lifecycle Automation ───────────────────────────────────────────
// Runs before everything else — fixes stuck orders & progresses statuses automatically

async function runOrderLifecycle(): Promise<{
  codFixed: number; pendingExpired: number; toFulfilling: number;
  toShipped: number; toDelivered: number;
}> {
  const now = Date.now();
  let codFixed = 0, pendingExpired = 0, toFulfilling = 0, toShipped = 0, toDelivered = 0;

  // 1. PENDING_COD → trigger automation (payment is on delivery, treat as paid)
  const codOrders = await prisma.order.findMany({
    where: { paymentStatus: { in: ['PENDING_COD'] } },
  });
  for (const o of codOrders) {
    await prisma.order.update({ where: { id: o.id }, data: { paymentStatus: 'PAID', updatedAt: new Date() } });
    await processOrderAutomation(o.id).catch(() => {});
    codFixed++;
  }

  // 2. PENDING / PENDING_TABBY / PENDING_TAMARA > 2h → FAILED (payment abandoned)
  const twoHoursAgo = new Date(now - 2 * 3_600_000);
  const expiredOrders = await prisma.order.findMany({
    where: {
      paymentStatus: { in: ['PENDING', 'PENDING_TABBY', 'PENDING_TAMARA'] },
      createdAt: { lt: twoHoursAgo },
    },
  });
  for (const o of expiredOrders) {
    await prisma.order.update({ where: { id: o.id }, data: { paymentStatus: 'FAILED', updatedAt: new Date() } });
    await prisma.systemLog.create({ data: { level: 'WARN', source: 'cron/order-lifecycle', message: `Order ${o.id} expired — payment not completed` } }).catch(() => {});
    pendingExpired++;
  }

  // 3. PAID_AND_ORDERED > 6h → FULFILLING (supplier confirmed, warehouse picking)
  const sixHoursAgo = new Date(now - 6 * 3_600_000);
  const orderedOrders = await prisma.order.findMany({
    where: { paymentStatus: 'PAID_AND_ORDERED', updatedAt: { lt: sixHoursAgo } },
  });
  for (const o of orderedOrders) {
    await prisma.order.update({ where: { id: o.id }, data: { paymentStatus: 'FULFILLING', updatedAt: new Date() } });
    toFulfilling++;
  }

  // 4. FULFILLING > 3 days → SHIPPED (CJ average dispatch time)
  const threeDaysAgo = new Date(now - 3 * 86_400_000);
  const fulfillingOrders = await prisma.order.findMany({
    where: { paymentStatus: 'FULFILLING', updatedAt: { lt: threeDaysAgo } },
  });
  for (const o of fulfillingOrders) {
    await prisma.order.update({ where: { id: o.id }, data: { paymentStatus: 'SHIPPED', updatedAt: new Date() } });
    toShipped++;
  }

  // 5. SHIPPED > 7 days → DELIVERED (Saudi average delivery window)
  const sevenDaysAgo = new Date(now - 7 * 86_400_000);
  const shippedOrders = await prisma.order.findMany({
    where: { paymentStatus: 'SHIPPED', updatedAt: { lt: sevenDaysAgo } },
  });
  for (const o of shippedOrders) {
    await prisma.order.update({ where: { id: o.id }, data: { paymentStatus: 'DELIVERED', updatedAt: new Date() } });
    toDelivered++;
  }

  await prisma.systemLog.create({
    data: {
      level: 'INFO',
      source: 'cron/order-lifecycle',
      message: `Lifecycle: COD→auto:${codFixed} | expired:${pendingExpired} | fulfilling:${toFulfilling} | shipped:${toShipped} | delivered:${toDelivered}`,
    },
  }).catch(() => {});

  return { codFixed, pendingExpired, toFulfilling, toShipped, toDelivered };
}

// ─── WhatsApp helpers ─────────────────────────────────────────────────────────

async function sendWhatsAppText(phone: string, message: string): Promise<void> {
  const token   = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId || token === 'placeholder') {
    console.log(`[WhatsApp-cron] No token — would send to ${phone}`);
    return;
  }
  const intl = phone.replace(/\D/g, '').replace(/^0/, '966');
  await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to: intl, type: 'text', text: { body: message } }),
  }).catch(console.error);
}

async function sendWhatsAppRecovery(phone: string, code: string | null, type: 'reminder' | 'discount'): Promise<void> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://saudilux.store';
  const msg = type === 'reminder'
    ? `مرحباً! 👋 لاحظنا إنك تركت بعض المنتجات الفاخرة في سلة التسوق.\n\nاكملي طلبك الآن وتمتعي بالتوصيل خلال 48 ساعة 🚀\n${siteUrl}`
    : `هدية خاصة لك! 🎁\n\nكود الخصم الحصري: *${code}*\nخصم 10% على طلبك الآن!\n\nالعرض ينتهي خلال 24 ساعة ⏰\n${siteUrl}`;
  await sendWhatsAppText(phone, msg);
}

// ─── Main GET Handler ─────────────────────────────────────────────────────────

export async function GET(req: import('next/server').NextRequest) {
  // Guard: Vercel sends Authorization: Bearer <CRON_SECRET>
  // Manual trigger: x-admin-key: <CRON_SECRET>
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization') ?? '';
    const key  = req.headers.get('x-admin-key') ?? '';
    if (auth !== `Bearer ${secret}` && key !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const masterStart = Date.now();
  const results: Record<string, unknown> = {};
  const hourUTC = new Date().getUTCHours();
  const isMorning = hourUTC === 6; // 06:00 UTC = 09:00 KSA
  const buildTag = 'v2-surveillance'; // build marker — remove after confirming deploy

  if (isMorning) {
    // ═══════════════════════════════════════════════════════
    // FULL_PIPELINE — runs once daily at 06:00 UTC
    // ═══════════════════════════════════════════════════════

    // 0. Order lifecycle automation (fixes stuck orders)
    try {
      results.orderLifecycle = await runOrderLifecycle();
    } catch (e) {
      results.orderLifecycle = { success: false, error: String(e) };
    }

    // 1. TITAN-10 full pipeline
    try {
      const report = await runTitan10('FULL_PIPELINE');
      results.titan10 = { success: true, duration: report.duration, pipeline: report.pipeline };
      await prisma.systemLog.create({ data: { level: 'SUCCESS', source: 'cron/master', message: `TITAN-10 FULL_PIPELINE complete in ${(report.duration / 1000).toFixed(1)}s` } });
    } catch (e) {
      results.titan10 = { success: false, error: String(e) };
      await alertCritical('cron/master → titan10', String(e));
    }

    // 2. Abandoned cart recovery
    try {
      results.cartRecovery = await runAbandonedCartRecovery();
    } catch (e) {
      results.cartRecovery = { success: false, error: String(e) };
    }

    // 3. Trust builder
    try {
      results.trustBuilder = await runTrustBuilder();
    } catch (e) {
      results.trustBuilder = { success: false, error: String(e) };
    }

    // 4. Empire engine (pricing)
    try {
      results.empireEngine = await runEmpireEngine();
    } catch (e) {
      results.empireEngine = { success: false, error: String(e) };
    }

    const totalMs = Date.now() - masterStart;

    // 5. Daily Telegram briefing
    const titan10   = results.titan10 as { duration?: number };
    const cart      = results.cartRecovery as { remindersSent?: number; discountsSent?: number };
    const trust     = results.trustBuilder as { requestsSent?: number };
    const empire    = results.empireEngine as { adjustments?: number };
    const lifecycle = results.orderLifecycle as { codFixed?: number; pendingExpired?: number; toShipped?: number; toDelivered?: number };

    await sendTelegramAlert('SUCCESS',
      `📊 *التقرير اليومي — Ashal Empire*\n\n` +
      `📦 دورة الطلبات: COD✅${lifecycle.codFixed ?? 0} | منتهية🚫${lifecycle.pendingExpired ?? 0} | شحن🚚${lifecycle.toShipped ?? 0} | وصلت🏠${lifecycle.toDelivered ?? 0}\n` +
      `🤖 TITAN-10: ${((titan10.duration ?? 0) / 1000).toFixed(1)}s\n` +
      `🛒 عربات مهجورة: ${(cart.remindersSent ?? 0)} تذكير + ${(cart.discountsSent ?? 0)} خصم\n` +
      `⭐ طلبات تقييم: ${trust.requestsSent ?? 0} رسالة\n` +
      `💹 تعديلات السعر: ${empire.adjustments ?? 0} منتج\n` +
      `⏱️ المدة الكلية: ${(totalMs / 1000).toFixed(1)}s`
    ).catch(() => {});

    await prisma.systemLog.create({
      data: {
        level: 'SUCCESS',
        source: 'cron/master',
        message: `Master FULL_PIPELINE complete in ${totalMs}ms`,
        metadata: JSON.stringify(results),
      },
    });

    return NextResponse.json({ success: true, mode: 'FULL_PIPELINE', hourUTC, buildTag, totalMs, results });

  } else {
    // ═══════════════════════════════════════════════════════
    // SURVEILLANCE — runs at 00, 04, 08, 12, 16, 20 UTC
    // Guardian: sync stock levels from CJ
    // OrdersSync: update tracking numbers for FULFILLING orders
    // Recovery: send abandoned cart reminders
    // ═══════════════════════════════════════════════════════
    try {
      const report = await runTitan10('SURVEILLANCE');
      results.surveillance = { success: true, duration: report.duration, ...report.surveillance };
      await prisma.systemLog.create({
        data: {
          level: 'INFO',
          source: 'cron/master',
          message: `SURVEILLANCE complete in ${(report.duration / 1000).toFixed(1)}s | hour: ${hourUTC}:00 UTC`,
          metadata: JSON.stringify(report.surveillance),
        },
      });
    } catch (e) {
      results.surveillance = { success: false, error: String(e) };
      await alertCritical('cron/master → surveillance', String(e));
    }

    const totalMs = Date.now() - masterStart;
    return NextResponse.json({ success: true, mode: 'SURVEILLANCE', hourUTC, buildTag, totalMs, results });
  }
}
