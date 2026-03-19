import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';
import { sendOrderConfirmation } from '@/lib/email';

const checkoutSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(9),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  region: z.string().min(2),
  paymentMethod: z.enum(['COD', 'CARD_TEST']),
  couponCode: z.string().optional(),
  locale: z.string().default('ar'),
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number().int().min(1),
    price: z.number().positive(),
    titleAr: z.string(),
    titleEn: z.string(),
    imageUrl: z.string().optional(),
  })).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = checkoutSchema.parse(body);

    const subtotal = data.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shippingFee = subtotal >= 200 ? 0 : 25;
    let discount = 0;

    // Coupon validation
    if (data.couponCode) {
      try {
        const coupon = await prisma.coupon.findFirst({
          where: { code: data.couponCode.toUpperCase(), isActive: true },
        });
        if (coupon) {
          const minOk = !coupon.minOrder || subtotal >= Number(coupon.minOrder);
          const notExpired = !coupon.expiresAt || coupon.expiresAt > new Date();
          const hasUses = !coupon.maxUses || coupon.usedCount < coupon.maxUses;
          if (minOk && notExpired && hasUses) {
            if (coupon.type === 'PERCENT') {
              discount = Math.round(subtotal * Number(coupon.value) / 100 * 100) / 100;
            } else {
              discount = Math.min(Number(coupon.value), subtotal);
            }
            await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
          }
        }
      } catch { /* coupon check failed silently */ }
    }

    const total = subtotal + shippingFee - discount;
    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        guestEmail: data.email,
        guestName: data.name,
        guestPhone: data.phone,
        addressSnapshot: {
          name: data.name,
          phone: data.phone,
          line1: data.line1,
          line2: data.line2 ?? '',
          city: data.city,
          region: data.region,
        },
        status: data.paymentMethod === 'CARD_TEST' ? 'PAID' : 'PENDING_PAYMENT',
        paymentMethod: data.paymentMethod,
        subtotal,
        shippingFee,
        discount,
        total,
        couponCode: data.couponCode ?? null,
        locale: data.locale,
        items: {
          create: data.items.map(i => ({
            productId: i.id,
            titleAr: i.titleAr,
            titleEn: i.titleEn,
            imageUrl: i.imageUrl ?? '',
            quantity: i.quantity,
            unitPrice: i.price,
            totalPrice: i.price * i.quantity,
          })),
        },
        payment: {
          create: {
            method: data.paymentMethod,
            amount: total,
            status: data.paymentMethod === 'CARD_TEST' ? 'paid' : 'pending',
            reference: data.paymentMethod === 'CARD_TEST' ? `TEST-${Date.now()}` : null,
            paidAt: data.paymentMethod === 'CARD_TEST' ? new Date() : null,
          },
        },
      },
    });

    // Send confirmation email (non-blocking)
    sendOrderConfirmation({
      to: data.email,
      orderNumber,
      total,
      items: data.items.map(i => ({
        titleAr: i.titleAr,
        titleEn: i.titleEn,
        quantity: i.quantity,
        unitPrice: i.price,
      })),
      locale: data.locale,
    }).catch(e => console.error('[email]', e));

    return NextResponse.json({ orderId: order.id, orderNumber });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('[checkout]', error);
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
  }
}
