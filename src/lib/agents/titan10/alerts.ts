/**
 * TITAN-10 | shared alert helper
 * Extracted to break circular dependency between ceo ↔ copywriter.
 */

import { prisma } from '@/lib/prisma';
import { sendTelegramAlert } from '@/lib/telegram';

export async function notifyCritical(source: string, context: string, err: unknown): Promise<void> {
  const msg = `🚨 CRITICAL — ${source}\n\nالسياق: ${context}\nالخطأ: ${String(err).slice(0, 200)}\n\nتحقق من السجلات فوراً.`;

  await Promise.allSettled([
    sendTelegramAlert('CRITICAL', msg),
    prisma.systemLog.create({
      data: {
        level: 'ERROR',
        source: `agent/${source.toLowerCase().replace(/\//g, '-')}`,
        message: `CRITICAL: ${context} — ${String(err).slice(0, 300)}`,
        metadata: JSON.stringify({ source, context }),
      },
    }),
  ]);
}
