import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY ?? 'test');

export async function sendOrderConfirmation(opts: {
  to: string;
  orderNumber: string;
  total: number;
  items: { titleAr: string; titleEn: string; quantity: number; unitPrice: number }[];
  locale: string;
}) {
  const isAr = opts.locale === 'ar';
  const subject = isAr ? `تأكيد طلبك #${opts.orderNumber}` : `Order Confirmation #${opts.orderNumber}`;
  const itemsHtml = opts.items.map(i =>
    `<tr><td>${isAr ? i.titleAr : i.titleEn}</td><td>${i.quantity}</td><td>${i.unitPrice} ر.س</td></tr>`
  ).join('');

  const html = `
    <div dir="${isAr ? 'rtl' : 'ltr'}" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
      <h1 style="color:#c8882a">${isAr ? 'تم تأكيد طلبك' : 'Order Confirmed'}</h1>
      <p>${isAr ? `رقم الطلب: <strong>${opts.orderNumber}</strong>` : `Order #: <strong>${opts.orderNumber}</strong>`}</p>
      <table width="100%" border="1" cellpadding="8" style="border-collapse:collapse">
        <thead><tr><th>${isAr ? 'المنتج' : 'Product'}</th><th>${isAr ? 'الكمية' : 'Qty'}</th><th>${isAr ? 'السعر' : 'Price'}</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <p><strong>${isAr ? 'الإجمالي' : 'Total'}: ${opts.total} ر.س</strong></p>
      <p style="color:#666">${isAr ? 'شكراً لتسوقك معنا في أسهل' : 'Thank you for shopping with Ashal'}</p>
    </div>
  `;

  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'test') {
    console.log('[EMAIL MOCK] Would send to:', opts.to, 'Subject:', subject);
    return { id: 'mock', success: true };
  }

  return resend.emails.send({
    from: process.env.FROM_EMAIL ?? 'orders@ashal.store',
    to: opts.to,
    subject,
    html,
  });
}
