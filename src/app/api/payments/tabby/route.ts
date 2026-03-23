/**
 * POST /api/payments/tabby
 * Creates a Tabby installment checkout session and returns the checkout URL.
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

  const TABBY_SECRET = process.env.TABBY_SECRET_KEY;
  const MERCHANT_CODE = process.env.TABBY_MERCHANT_CODE ?? 'ASHAL';
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ashal-three.vercel.app';

  if (!TABBY_SECRET) {
    return NextResponse.json({ error: 'Tabby not configured' }, { status: 503 });
  }

  const res = await fetch('https://api.tabby.ai/api/v2/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TABBY_SECRET}`,
    },
    body: JSON.stringify({
      payment: {
        amount: amount.toFixed(2),
        currency: 'SAR',
        description: productTitle,
        buyer: { phone, name: name ?? 'Customer' },
        shipping_address: { city: city ?? 'Riyadh', address: '', zip: '' },
        order: {
          reference_id: orderId,
          items: [{ title: productTitle, quantity: 1, unit_price: amount.toFixed(2), category: 'Clothing & Accessories' }],
        },
        buyer_history: { registered_since: new Date().toISOString(), loyalty_level: 0 },
        order_history: [],
      },
      merchant_code: MERCHANT_CODE,
      merchant_urls: {
        success: `${SITE_URL}/checkout/callback?provider=tabby&status=authorized&orderId=${orderId}`,
        cancel:  `${SITE_URL}/checkout/callback?provider=tabby&status=canceled&orderId=${orderId}`,
        failure: `${SITE_URL}/checkout/callback?provider=tabby&status=rejected&orderId=${orderId}`,
      },
      lang: 'ar',
    }),
  });

  const data = await res.json() as {
    configuration?: { available_products?: { installments?: Array<{ web_url?: string }> } };
    error?: string;
  };

  if (!res.ok) {
    await prisma.systemLog.create({
      data: { level: 'ERROR', source: 'payments/tabby', message: `Tabby error: ${JSON.stringify(data)}` }
    }).catch(() => {});
    return NextResponse.json({ error: data.error ?? 'Tabby API error' }, { status: res.status });
  }

  const checkoutUrl = data.configuration?.available_products?.installments?.[0]?.web_url;
  if (!checkoutUrl) {
    return NextResponse.json({ error: 'No installment URL returned from Tabby' }, { status: 502 });
  }

  await prisma.systemLog.create({
    data: { level: 'INFO', source: 'payments/tabby', message: `Tabby session created for order ${orderId}` }
  }).catch(() => {});

  return NextResponse.json({ checkoutUrl });
}
