/**
 * Phase 2: Moyasar Webhook — Full Data Handshake
 * Flow: Moyasar Payment → Update Neon DB → Supplier Automation → System Log
 * Endpoint: POST /api/webhooks/moyasar
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { processOrderAutomation } from '@/lib/order-automation';
import crypto from 'crypto';

// Verify Moyasar webhook signature (HMAC-SHA256)
function verifyMoyasarSignature(payload: string, signature: string, secret: string): boolean {
  if (!secret || secret === 'PENDING') return true; // no secret configured — allow (dev)
  if (!signature) return false;                      // secret set but no sig header — reject
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-moyasar-signature') ?? '';

  // Signature verification
  if (!verifyMoyasarSignature(rawBody, signature, process.env.MOYASAR_WEBHOOK_SECRET ?? '')) {
    await prisma.systemLog.create({
      data: { level: 'ERROR', source: 'webhook/moyasar', message: 'Invalid webhook signature — rejected' }
    });
    return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody);
    const { id: paymentId, status, amount, metadata } = payload;

    await prisma.systemLog.create({
      data: {
        level: 'INFO',
        source: 'webhook/moyasar',
        message: `Webhook received: status=${status}, payment=${paymentId}`,
        metadata: JSON.stringify({ paymentId, status, amount }),
      }
    });

    if (status === 'paid') {
      const orderId = metadata?.orderId;
      if (!orderId) {
        await prisma.systemLog.create({ data: { level: 'WARN', source: 'webhook/moyasar', message: 'Paid webhook missing orderId in metadata' } });
        return NextResponse.json({ success: false, error: 'Missing orderId' }, { status: 400 });
      }

      // 1. Update order → PAID in Neon DB
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus:    'PAID',
          moyasarPaymentId: paymentId,
          updatedAt:        new Date(),
        }
      });

      // 2. Trigger supplier automation (CJ / Mkhazen)
      const automationResult = await processOrderAutomation(orderId);

      // 3. Log success
      await prisma.systemLog.create({
        data: {
          level:    automationResult.success ? 'SUCCESS' : 'WARN',
          source:   'webhook/moyasar',
          message:  `Order ${orderId} → ${automationResult.success ? 'FULFILLING' : 'Automation partial'}`,
          metadata: JSON.stringify({ paymentId, orderId, ...automationResult }),
        }
      });

      return NextResponse.json({ success: true, orderId, automation: automationResult });
    }

    if (status === 'failed') {
      const orderId = metadata?.orderId;
      if (orderId) {
        await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: 'FAILED', updatedAt: new Date() } });
        await prisma.systemLog.create({ data: { level: 'WARN', source: 'webhook/moyasar', message: `Payment failed for order ${orderId}` } });
      }
    }

    return NextResponse.json({ success: true, status: 'acknowledged' });

  } catch (error) {
    await prisma.systemLog.create({
      data: { level: 'ERROR', source: 'webhook/moyasar', message: `Webhook processing error: ${String(error)}` }
    }).catch(() => {});
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
