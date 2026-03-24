/**
 * The Ultimate Saudi Dropship 2026 - Order Automation Engine
 * محرك أتمتة الطلبات - يربط بين عملية الشراء والمورد آلياً.
 */

import { prisma } from '@/lib/prisma';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { sendTelegramAlert as telegramAlert } from '@/lib/telegram';
import { cjCreateOrder } from '@/lib/cj-supplier';

export async function processOrderAutomation(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { product: true }
    });

    if (!order) throw new Error("Order not found");

    console.log(`🤖 CTO-Mode: Processing Order ${orderId} for product ${order.product.titleAr}`);

    // 1. Submit to Supplier (CJ Dropshipping — real OAuth token or simulation fallback)
    const supplierResponse = await cjCreateOrder({
      orderNumber: `SL-${orderId.slice(-8).toUpperCase()}`,
      shippingCountry: 'SA',
      shippingCity: order.customerCity ?? 'Riyadh',
      productName: order.product.titleEn,
      quantity: 1,
    });

    // 2. Initialize Logistic Bot
    await prisma.logisticBot.create({
      data: {
        orderId: order.id,
        chosenCourier: "Aramex (Priority Saudi)",
        shippingCost: order.product.shippingCost,
        whiteLabeled: true
      }
    });

    // 3. Update Order Status with tracking number
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID_AND_ORDERED",
        trackingNumber: supplierResponse.trackingNumber,
      }
    });

    // 4. Send order confirmation email
    const customerEmail = (order as unknown as Record<string, unknown>).customerEmail as string | undefined;
    if (customerEmail) {
      await sendOrderConfirmationEmail({
        orderId: order.id,
        customerName: order.customerName ?? 'عزيزي العميل',
        customerEmail,
        customerPhone: order.customerPhone ?? '',
        productTitleAr: order.product.titleAr,
        productTitleEn: order.product.titleEn,
        totalAmount: Number(order.totalAmount),
        trackingNumber: supplierResponse.trackingNumber,
        city: order.customerCity ?? '',
      });
    }

    // 5. WhatsApp notification via API
    await sendWhatsAppNotification(
      order.customerPhone ?? '',
      order.customerName ?? 'عزيزي العميل',
      order.product.titleAr,
      orderId,
      supplierResponse.trackingNumber ?? ''
    );

    // 6. Telegram alert to admin
    await telegramAlert('SALE', `طلب جديد\n🆔 ${order.id.slice(-8).toUpperCase()}\n🛍️ ${order.product.titleAr}\n💰 ${Number(order.totalAmount).toFixed(2)} SAR\n📦 تتبع: ${supplierResponse.trackingNumber}`);

    // 7. Log success to SystemLog
    await prisma.systemLog.create({
      data: {
        level: 'SUCCESS',
        source: 'OrderAutomation',
        message: `Order ${orderId} automated — tracking: ${supplierResponse.trackingNumber}`,
      }
    });

    console.log(`✅ Order ${orderId} automated with tracking: ${supplierResponse.trackingNumber}`);
    return { success: true, trackingNumber: supplierResponse.trackingNumber };

  } catch (error) {
    console.error("Order Automation Failure:", error);
    await prisma.systemLog.create({
      data: {
        level: 'ERROR',
        source: 'OrderAutomation',
        message: `Failed to automate order ${orderId}: ${String(error)}`,
      }
    }).catch(() => {});
    return { success: false, error: "Automation Loop Interrupted" };
  }
}

// ─── WhatsApp Business Cloud API ────────────────────────────────────────────
async function sendWhatsAppNotification(
  phone: string,
  name: string,
  productTitle: string,
  orderId: string,
  tracking: string
) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://saudilux.store';

  if (!token || !phoneNumberId || token === 'placeholder') {
    console.log(`[WhatsApp] No token — would notify ${phone} for order ${orderId}`);
    return;
  }

  const cleanPhone = phone.replace(/\D/g, '');
  const intlPhone = cleanPhone.startsWith('0') ? `966${cleanPhone.slice(1)}` : cleanPhone;

  const body = {
    messaging_product: 'whatsapp',
    to: intlPhone,
    type: 'text',
    text: {
      body: `✅ مرحباً ${name}!\n\nتم تأكيد طلبك في SAUDILUX:\n🛍️ ${productTitle}\n📦 رقم التتبع: ${tracking}\n\nتابع طلبك: ${siteUrl}/orders/${orderId}\n\nشكراً لثقتك بنا 🇸🇦`,
    },
  };

  await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(r => r.json()).then(d => console.log('[WhatsApp]', d)).catch(console.error);
}

