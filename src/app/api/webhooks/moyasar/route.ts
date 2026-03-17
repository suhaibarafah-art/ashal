/**
 * Moyasar Payment Webhook Handler
 * يستقبل تأكيدات الدفع من بوابة ميسر ويقوم بتنشيط الأتمتة اللوجستية.
 */

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { processOrderAutomation } from '@/lib/order-automation';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // In production, verify Moyasar signature here
    const { id: paymentId, status, amount, metadata } = payload;

    if (status === 'paid') {
      const orderId = metadata.orderId;
      
      console.log(`💰 Payment Confirmed: ${paymentId} for Order ${orderId}`);

      // 1. Update Order Status
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: "PAID" }
      });

      // 2. Trigger Supplier Automation
      await processOrderAutomation(orderId);

      return NextResponse.json({ success: true, message: "Order processed via webhook" });
    }

    return NextResponse.json({ success: true, status: "ignored" });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
