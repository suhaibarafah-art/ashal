/**
 * Phase 2: Order API — Full field support + coupon validation
 * POST /api/orders — creates order in Neon, validates coupon, returns Moyasar payload
 * GET  /api/orders — list recent orders for admin
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { applyCoupon } from '@/lib/pricing-engine';
import { rateLimit } from '@/lib/rate-limit';
import { processOrderAutomation } from '@/lib/order-automation';

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const { ok, remaining } = rateLimit(ip);
  if (!ok) {
    return NextResponse.json(
      { success: false, error: 'حد الطلبات المسموح به: يرجى الانتظار دقيقة ثم المحاولة مجدداً' },
      { status: 429, headers: { 'Retry-After': '60', 'X-RateLimit-Remaining': '0' } }
    );
  }

  try {
    const body = await req.json() as {
      productId:       string;
      customerName?:   string;
      phone:           string;
      city:            string;
      address?:        string;
      amount:          number | string;
      couponCode?:     string;
      paymentMethod?:  'online' | 'cod' | 'tabby' | 'tamara';
    };

    const { productId, phone, city } = body;
    if (!productId || !phone || !city) {
      return NextResponse.json({ success: false, error: 'productId, phone, city required' }, { status: 400 });
    }

    // Verify product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    let totalAmount = parseFloat(String(body.amount)) || product.finalPrice;
    let discountAmount = 0;
    let couponId: string | undefined;

    // Apply coupon if provided
    if (body.couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: body.couponCode.toUpperCase() } });
      if (coupon && coupon.isActive && coupon.usageCount < coupon.maxUsage) {
        const { discountedPrice, discountAmount: d } = applyCoupon(totalAmount, body.couponCode);
        totalAmount = discountedPrice;
        discountAmount = d;
        couponId = coupon.id;
        await prisma.coupon.update({ where: { id: coupon.id }, data: { usageCount: { increment: 1 } } });
      }
    }

    // Create order in DB (Neon in production)
    const order = await prisma.order.create({
      data: {
        productId,
        customerName:    body.customerName ?? '',
        customerPhone:   phone,
        customerCity:    city,
        customerAddress: body.address ?? '',
        totalAmount,
        discountAmount,
        paymentStatus:   body.paymentMethod === 'cod' ? 'PENDING_COD'
                     : body.paymentMethod === 'tabby' ? 'PENDING_TABBY'
                     : body.paymentMethod === 'tamara' ? 'PENDING_TAMARA'
                     : 'PENDING',
        ...(couponId ? { couponId } : {}),
      }
    });

    // Log to system
    await prisma.systemLog.create({
      data: {
        level:    'INFO',
        source:   'orders',
        message:  `Order created: ${order.id} — SAR ${totalAmount.toFixed(2)}`,
        metadata: JSON.stringify({ productId, city, coupon: body.couponCode ?? null }),
      }
    }).catch(() => {});

    // COD: mark PAID immediately and trigger automation (no payment gateway needed)
    if (body.paymentMethod === 'cod') {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'PAID', updatedAt: new Date() }
      });
      // Fire automation async — don't block the response
      processOrderAutomation(order.id).catch((e) =>
        console.error(`[COD] Automation failed for ${order.id}:`, e)
      );
    }

    // Return order ID + Moyasar payload
    const moyasarPublishableKey = process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY ?? '';
    return NextResponse.json({
      success:    true,
      orderId:    order.id,
      totalAmount,
      discountAmount,
      moyasarKey: moyasarPublishableKey,
      // Amount in halalas (SAR × 100) for Moyasar API
      amountHalalas: Math.round(totalAmount * 100),
      message:    body.paymentMethod === 'cod'
        ? 'تم تأكيد الطلب — سيتواصل معك المندوب قريباً'
        : 'تم إنشاء الطلب بنجاح — المرحلة التالية: الدفع عبر Moyasar',
    });

  } catch (error) {
    await prisma.systemLog.create({
      data: { level: 'ERROR', source: 'orders', message: `Order creation failed: ${String(error)}` }
    }).catch(() => {});
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 200);
  const status = searchParams.get('status') ?? undefined;

  const orders = await prisma.order.findMany({
    where: status ? { paymentStatus: status } : {},
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { product: { select: { titleAr: true, titleEn: true, finalPrice: true } } },
  });

  const revenue = orders
    .filter(o => ['PAID', 'FULFILLING', 'SHIPPED', 'DELIVERED', 'PAID_AND_ORDERED'].includes(o.paymentStatus))
    .reduce((s, o) => s + o.totalAmount, 0);

  return NextResponse.json({ success: true, count: orders.length, revenue: Math.round(revenue * 100) / 100, orders });
}
