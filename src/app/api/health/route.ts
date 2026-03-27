import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [productCount, orderCount] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
    ]);

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      db: 'connected',
      products: productCount,
      orders: orderCount,
      env: {
        moyasar: !!(process.env.MOYASAR_API_KEY || process.env.MOYASAR_SECRET_KEY || process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY),
        cj: !!process.env.CJ_API_KEY,
        resend: !!process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'test',
        whatsapp: !!process.env.WHATSAPP_TOKEN,
        gemini: !!process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.startsWith('your_'),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', error: String(error), timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
