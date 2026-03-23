/**
 * POST /api/payments/verify
 * Verifies payment status from Moyasar/Tabby/Tamara callbacks and updates order.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { orderId, provider, status, paymentId } = await req.json() as {
    orderId: string;
    provider: string;
    status?: string;
    paymentId?: string;
  };

  if (!orderId) {
    return NextResponse.json({ success: false, error: 'orderId required' }, { status: 400 });
  }

  try {
    // ── Moyasar: verify via API ──────────────────────────────────────────────
    if (provider === 'moyasar' && paymentId) {
      const res = await fetch(`https://api.moyasar.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.MOYASAR_API_KEY}:`).toString('base64')}`,
        },
      });
      const payment = await res.json() as { status?: string; metadata?: { orderId?: string } };

      if (payment.status === 'paid' && payment.metadata?.orderId === orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { paymentStatus: 'PAID', moyasarPaymentId: paymentId },
        });
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ success: false, error: 'Payment not verified' });
    }

    // ── Tabby / Tamara: trust callback status ────────────────────────────────
    const approvedStatuses = ['authorized', 'approved'];
    if (approvedStatuses.includes(status ?? '')) {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'PAID' },
      });
      await prisma.systemLog.create({
        data: {
          level: 'INFO',
          source: `payments/verify`,
          message: `Order ${orderId} marked PAID via ${provider}`,
        },
      }).catch(() => {});
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: `Status not approved: ${status}` });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
