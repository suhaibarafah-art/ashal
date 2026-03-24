/**
 * Telegram Alert System — Instant CEO Notifications
 * نظام إشعارات تيليجرام الفوري للمدير التنفيذي
 *
 * Requires: TELEGRAM_BOT_TOKEN + TELEGRAM_CEO_CHAT_ID in .env
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CEO_CHAT_ID = process.env.TELEGRAM_CEO_CHAT_ID;

type AlertType = 'SUCCESS' | 'SALE' | 'CRITICAL';

const ALERT_ICONS: Record<AlertType, string> = {
  SUCCESS: '✅',
  SALE:    '💰',
  CRITICAL: '🚨',
};

export async function sendTelegramAlert(type: AlertType, message: string): Promise<void> {
  if (!BOT_TOKEN || !CEO_CHAT_ID) {
    console.warn(`[Telegram] Missing credentials — skipping ${type} alert. Add TELEGRAM_BOT_TOKEN + TELEGRAM_CEO_CHAT_ID to .env`);
    return;
  }

  const icon = ALERT_ICONS[type];
  const text = `${icon} *[${type}] Ashal Empire*\n\n${message}\n\n_${new Date().toLocaleString('en-US')}_`;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CEO_CHAT_ID,
          text,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('[Telegram] Send failed:', err);
    } else {
      console.log(`[Telegram] ${type} alert sent to CEO.`);
    }
  } catch (error) {
    console.error('[Telegram] Network error:', error);
  }
}

// Convenience helpers
export const alertSale = (productAr: string, amount: number, city: string) =>
  sendTelegramAlert('SALE', `طلب جديد!\n\n📦 المنتج: ${productAr}\n💵 المبلغ: SAR ${amount}\n📍 المدينة: ${city}`);

export const alertSuccess = (message: string) =>
  sendTelegramAlert('SUCCESS', message);

export const alertCritical = (context: string, error: string) =>
  sendTelegramAlert('CRITICAL', `السياق: ${context}\n\nالخطأ:\n\`\`\`\n${error}\n\`\`\``);
