/**
 * TITAN-10 | Agent 3 & 7 — Critic + Price Validator
 * Reads PENDING_CRITIC items.
 * Hard Requirements:
 *   - Margin >= 35%   [ (finalPrice - baseCost - shippingCost) / finalPrice ]
 *   - Image URL is non-empty, starts with https, length > 20
 * Pass → PENDING_COPY
 * Fail → ARCHIVED
 */

import { prisma } from '@/lib/prisma';
import { calculateLuxuryPrice } from '@/lib/pricing-engine';

const MARGIN_THRESHOLD = 0.35; // 35%

function isHighResImage(url: string): boolean {
  if (!url || url.length < 20) return false;
  if (!url.startsWith('https')) return false;
  // Reject tiny placeholder-like URLs
  if (url.includes('placeholder') || url.includes('noimage')) return false;
  return true;
}

function calcMargin(baseCost: number, shippingCost: number): number {
  const finalPrice = calculateLuxuryPrice(baseCost, shippingCost);
  if (finalPrice <= 0) return 0;
  return (finalPrice - baseCost - shippingCost) / finalPrice;
}

export async function runCritic(): Promise<{ passed: number; archived: number }> {
  let passed = 0;
  let archived = 0;

  const items = await prisma.agentTaskQueue.findMany({
    where: { status: 'PENDING_CRITIC' },
    take: 50,
  });

  for (const item of items) {
    const margin       = calcMargin(item.baseCost, item.shippingCost);
    const imageOk      = isHighResImage(item.imageUrl);
    const marginOk     = margin >= MARGIN_THRESHOLD;
    const passes       = imageOk && marginOk;

    const reason = !marginOk
      ? `Margin ${(margin * 100).toFixed(1)}% < 35%`
      : !imageOk
        ? `Image failed quality check: ${item.imageUrl.slice(0, 60)}`
        : 'OK';

    await prisma.agentTaskQueue.update({
      where: { id: item.id },
      data: {
        status:     passes ? 'PENDING_COPY' : 'ARCHIVED',
        marginPct:  margin * 100,
        agentNotes: `Critic: ${reason}`,
        errorLog:   passes ? '' : reason,
      },
    });

    passes ? passed++ : archived++;
  }

  await prisma.systemLog.create({
    data: {
      level: 'INFO',
      source: 'agent/critic',
      message: `Critic complete: ${passed} passed (≥35% margin), ${archived} archived`,
      metadata: JSON.stringify({ passed, archived, threshold: '35%' }),
    },
  });

  return { passed, archived };
}
