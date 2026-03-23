/**
 * POST /api/payments/tamara
 * Creates a Tamara 3-installment checkout session and returns the checkout URL.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { orderId, amount, productTitle, phone, name, city } = await req.json() as {
    orderId: string;
    amount: number;
    productTitle: string;
    phone: string;
    name?: string;
    city?: string;
  };

  const TAMARA_TOKEN = process.env.TAMARA_API_TOKEN;
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ashal-three.vercel.app';

  if (!TAMARA_TOKEN) {
    return NextResponse.json({ error: 'Tamara not configured' }, { status: 503 });
  }

  const res = await fetch('https://api.tamara.co/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TAMARA_TOKEN}`,
    },
    body: JSON.stringify({
      order_reference_id: orderId,
      total_amount: { amount: amount.toFixed(2), currency: 'SAR' },
      description: productTitle,
      country_code: 'SA',
      payment_type: 'PAY_BY_INSTALMENTS',
      instalments: 3,
      customer: { phone_number: phone, first_name: name ?? 'Customer', last_name: '' },
      shipping_address: { city: city ?? 'Riyadh', country_code: 'SA' },
      items: [{
        name: productTitle,
        quantity: 1,
        unit_price:   { amount: amount.toFixed(2), currency: 'SAR' },
        total_amount: { amount: amount.toFixed(2), currency: 'SAR' },
        category: 'clothing',
      }],
      merchant_url: {
        success:      `${SITE_URL}/checkout/callback?provider=tamara&status=approved&orderId=${orderId}`,
        cancel:       `${SITE_URL}/checkout/callback?provider=tamara&status=canceled&orderId=${orderId}`,
        failure:      `${SITE_URL}/checkout/callback?provider=tamara&status=declined&orderId=${orderId}`,
        notification: `${SITE_URL}/api/webhooks/tamara`,
      },
      locale:   'ar_SA',
      platform: 'WEB',
    }),
  });

  const data = await res.json() as { checkout_url?: string; message?: string };

  if (!res.ok) {
    await prisma.systemLog.create({
      data: { level: 'ERROR', source: 'payments/tamara', message: `Tamara error: ${JSON.stringify(data)}` }
    }).catch(() => {});
    return NextResponse.json({ error: data.message ?? 'Tamara API error' }, { status: res.status });
  }

  const checkoutUrl = data.checkout_url;
  if (!checkoutUrl) {
    return NextResponse.json({ error: 'No checkout URL returned from Tamara' }, { status: 502 });
  }

  await prisma.systemLog.create({
    data: { level: 'INFO', source: 'payments/tamara', message: `Tamara session created for order ${orderId}` }
  }).catch(() => {});

  return NextResponse.json({ checkoutUrl });
}
