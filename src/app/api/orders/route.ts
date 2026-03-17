/**
 * Order Creation API
 * يستقبل طلبات الشراء ويقوم بتنشيط محرك الأتمتة فوراً.
 */

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { processOrderAutomation } from '@/lib/order-automation';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { productId, phone, city, amount } = await req.json();

    // 1. Create the Order in DB
    const order = await prisma.order.create({
      data: {
        productId,
        customerPhone: phone,
        customerCity: city,
        totalAmount: parseFloat(amount),
        paymentStatus: "PENDING"
      }
    });

    // 2. Trigger Autonomous Automation (In background or immediately for demo)
    console.log(`🚀 CTO-Mode: Triggering self-sustaining loop for Order ${order.id}`);
    const automationResult = await processOrderAutomation(order.id);

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      automation: automationResult,
      message: "تم استلام طلبك وتنشيط الأتمتة المالية واللوجستية فوراً طال عمرك."
    });

  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json({ success: false, error: 'Order Creation Failed' }, { status: 500 });
  }
}
