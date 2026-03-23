/**
 * Email Service — Resend
 * Sends Arabic order confirmation emails with luxury branding
 */

import { Resend } from 'resend';

// Lazy initialization — avoids throwing at build time when key is absent
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder');
  return _resend;
}
const FROM = process.env.EMAIL_FROM ?? 'SAUDILUX <noreply@saudilux.sa>';

export interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  productTitleAr: string;
  productTitleEn: string;
  totalAmount: number;
  trackingNumber?: string;
  city: string;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'test') {
    console.log(`[Email] No RESEND_API_KEY — skipping email for order ${data.orderId}`);
    return { success: false, reason: 'no_api_key' };
  }
  if (!data.customerEmail) {
    console.log(`[Email] No customer email for order ${data.orderId}`);
    return { success: false, reason: 'no_email' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://saudilux.store';
  const trackingUrl = `${siteUrl}/orders/${data.orderId}`;

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تأكيد طلبك — SAUDILUX</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Segoe UI',Arial,sans-serif;direction:rtl;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#002366;padding:32px 40px;text-align:center;">
              <div style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-1px;">
                SAUDI<span style="color:#FFDB58">LUX</span>
              </div>
              <div style="font-size:10px;color:rgba(144,202,249,0.7);letter-spacing:4px;margin-top:4px;text-transform:uppercase;">
                Luxury Empire 2026
              </div>
            </td>
          </tr>

          <!-- Orange banner -->
          <tr>
            <td style="background:#FF8C00;padding:14px 40px;text-align:center;">
              <p style="margin:0;color:white;font-size:15px;font-weight:700;">
                ✅ تم تأكيد طلبك بنجاح!
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="font-size:16px;color:#1a1a2e;margin:0 0 8px 0;font-weight:700;">
                مرحباً ${data.customerName}،
              </p>
              <p style="font-size:14px;color:#555;margin:0 0 28px 0;line-height:1.7;">
                شكراً على ثقتك بـ SAUDILUX. تم استلام طلبك وسيتم شحنه قريباً إلى مدينة <strong>${data.city}</strong>.
              </p>

              <!-- Order Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9ff;border:1px solid #e8ecff;border-radius:8px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px 0;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:2px;">تفاصيل الطلب</p>
                    <p style="margin:0 0 16px 0;font-size:13px;color:#999;font-family:monospace;">رقم الطلب: ${data.orderId.slice(-8).toUpperCase()}</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:15px;color:#1a1a2e;font-weight:700;padding-bottom:8px;">${data.productTitleAr}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#888;padding-bottom:16px;">${data.productTitleEn}</td>
                      </tr>
                      <tr>
                        <td style="border-top:1px solid #e8ecff;padding-top:16px;">
                          <span style="font-size:22px;font-weight:900;color:#FF8C00;">${data.totalAmount.toFixed(2)} SAR</span>
                        </td>
                      </tr>
                    </table>
                    ${data.trackingNumber ? `
                    <div style="margin-top:16px;padding:10px 14px;background:#e8fff2;border-radius:6px;border:1px solid #b2f0d0;">
                      <p style="margin:0;font-size:12px;color:#16a34a;font-weight:700;">📦 رقم التتبع: ${data.trackingNumber}</p>
                    </div>` : ''}
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 28px 0;">
                    <a href="${trackingUrl}" style="display:inline-block;background:#FF8C00;color:white;text-decoration:none;padding:14px 36px;border-radius:30px;font-size:15px;font-weight:700;box-shadow:0 4px 18px rgba(255,140,0,0.4);">
                      تتبع طلبك
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:13px;color:#888;line-height:1.7;border-top:1px solid #f0f0f0;padding-top:24px;margin:0;">
                إذا كان لديك أي استفسار، تواصل معنا على واتساب أو زر صفحة الدعم.
                <br>فريق SAUDILUX يتمنى لك تجربة تسوق لا مثيل لها 🇸🇦
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#002366;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:2px;text-transform:uppercase;">
                © 2026 SAUDILUX — All Rights Reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const result = await getResend().emails.send({
      from: FROM,
      to: data.customerEmail,
      subject: `✅ تم تأكيد طلبك — ${data.productTitleAr} | SAUDILUX`,
      html,
    });
    console.log(`[Email] Sent confirmation to ${data.customerEmail}`, result);
    return { success: true, id: result.data?.id };
  } catch (err) {
    console.error('[Email] Failed to send:', err);
    return { success: false, error: String(err) };
  }
}

export async function sendShippingUpdateEmail(data: OrderEmailData) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'test') return;
  if (!data.customerEmail) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://saudilux.store';
  const trackingUrl = `${siteUrl}/orders/${data.orderId}`;

  await getResend().emails.send({
    from: FROM,
    to: data.customerEmail,
    subject: `🚚 طلبك في الطريق إليك — ${data.productTitleAr}`,
    html: `
<div dir="rtl" style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:32px;">
  <h1 style="color:#002366;">SAUDI<span style="color:#FFDB58">LUX</span></h1>
  <p style="font-size:16px;font-weight:700;">طلبك في الطريق إليك! 🚚</p>
  <p>مرحباً ${data.customerName}، تم شحن طلب <strong>${data.productTitleAr}</strong> وهو الآن في الطريق إليك.</p>
  ${data.trackingNumber ? `<p style="background:#f0f9ff;padding:12px;border-radius:8px;font-weight:700;">رقم التتبع: ${data.trackingNumber}</p>` : ''}
  <a href="${trackingUrl}" style="display:inline-block;background:#FF8C00;color:white;padding:12px 28px;border-radius:24px;text-decoration:none;font-weight:700;margin-top:16px;">تتبع طلبك</a>
</div>`,
  }).catch(console.error);
}
