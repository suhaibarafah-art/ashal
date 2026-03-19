import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();
    if (!code) return NextResponse.json({ valid: false, message: 'No code' });

    const coupon = await prisma.coupon.findFirst({
      where: { code: code.toUpperCase(), isActive: true },
    });

    if (!coupon) return NextResponse.json({ valid: false, message: 'ar:كود الخصم غير صحيح|en:Invalid coupon code' });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return NextResponse.json({ valid: false, message: 'ar:انتهت صلاحية الكود|en:Coupon expired' });
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return NextResponse.json({ valid: false, message: 'ar:تم استخدام هذا الكود|en:Coupon exhausted' });
    if (coupon.minOrder && subtotal < Number(coupon.minOrder)) {
      return NextResponse.json({ valid: false, message: `ar:الحد الأدنى للطلب ${coupon.minOrder} ر.س|en:Min order ${coupon.minOrder} SAR` });
    }

    const discount = coupon.type === 'PERCENT'
      ? Math.round(subtotal * Number(coupon.value) / 100 * 100) / 100
      : Math.min(Number(coupon.value), subtotal);

    return NextResponse.json({ valid: true, discount, type: coupon.type, value: Number(coupon.value) });
  } catch {
    return NextResponse.json({ valid: false, message: 'Error' }, { status: 500 });
  }
}
