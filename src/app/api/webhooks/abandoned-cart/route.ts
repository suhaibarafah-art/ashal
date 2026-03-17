import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 💼 The Sovereign Empire - Abandoned Cart Recovery (Cron Webhook)
 * This route is intended to be called by a Vercel Cron Job every hour.
 */
export async function GET(req: Request) {
  try {
    // 1. Fetch carts that have been abandoned but not recovered/lost
    const carts = await prisma.abandonedCart.findMany({
      where: {
        status: 'pending'
      }
    });

    const now = new Date();
    let remindersSent = 0;
    let discountsSent = 0;

    for (const cart of carts) {
      const targetTime = new Date(cart.createdAt);
      const hoursDiff = Math.abs(now.getTime() - targetTime.getTime()) / 3600000;

      // 4-Hour Rule: First Reminder
      if (hoursDiff >= 4 && hoursDiff < 24 && !cart.remindedAt) {
        // [SIMULATION: Send Email / WhatsApp "Your cart misses you"]
        console.log(`[Loyalty Engine] Sending 4-Hour Reminder to ${cart.email ?? cart.phone}`);
        
        await prisma.abandonedCart.update({
          where: { id: cart.id },
          data: { remindedAt: now }
        });
        remindersSent++;
      } 
      // 24-Hour Rule: 10% Discount Drop
      else if (hoursDiff >= 24) {
         // [SIMULATION: Send Email with 10% Code "SOVEREIGN10"]
         console.log(`[Loyalty Engine] Dropping 10% VIP Discount to ${cart.email ?? cart.phone}`);
         
         await prisma.abandonedCart.update({
             where: { id: cart.id },
             data: { 
                 status: 'discount_sent',
                 discountCode: 'SOVEREIGN10' 
             }
         });
         discountsSent++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Sovereign Recovery Engine executed.',
      stats: { remindersSent, discountsSent }
    });
  } catch (error) {
    console.error('Abandon Cart Engine Error:', error);
    return NextResponse.json({ error: 'Failed to execute recovery' }, { status: 500 });
  }
}
