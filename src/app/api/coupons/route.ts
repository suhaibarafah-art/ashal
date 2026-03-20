import { NextResponse } from 'next/server';
import { applyCoupon } from '@/lib/pricing-engine';
import { prisma } from '@/lib/prisma';

/**
 * Phase 4: Coupon Engine API
 * POST /api/coupons — validate + apply coupon
 * Body: { code: "SAVE10", price: 500.99 }
 */
export async function POST(req: Request) {
  try {
    const { code, price } = await req.json() as { code: string; price: number };

    if (!code || !price) {
      return NextResponse.json({ success: false, error: 'code and price required' }, { status: 400 });
    }

    // Check DB
    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

    if (!coupon) {
      return NextResponse.json({ success: false, error: 'كود الخصم غير صحيح' }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ success: false, error: 'كود الخصم منتهي الصلاحية' }, { status: 400 });
    }

    if (coupon.usageCount >= coupon.maxUsage) {
      return NextResponse.json({ success: false, error: 'تم تجاوز الحد الأقصى لاستخدام الكود' }, { status: 400 });
    }

    const { discountedPrice, discountAmount } = applyCoupon(price, code);

    return NextResponse.json({
      success: true,
      code:            coupon.code,
      discountPct:     coupon.discountPct,
      discountAmount,
      originalPrice:   price,
      discountedPrice,
      message: `تم تطبيق خصم ${Math.round(coupon.discountPct * 100)}% — وفّرت ${discountAmount.toFixed(2)} ريال`,
    });

  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
