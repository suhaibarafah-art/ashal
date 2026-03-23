/**
 * POST /api/cron/titan10
 * Smart dispatcher — runs every 4 hours (single cron, Hobby plan).
 *
 * Hour logic (UTC):
 *   06:00 → FULL_PIPELINE + Analyst  (Scout → Critic → Copy → Strategy → CEO → Report)
 *   10:00, 14:00, 18:00, 22:00, 02:00 → SURVEILLANCE only (Guardian + Orders + Recovery)
 *
 * Secured by CRON_SECRET header.
 */

import { NextRequest, NextResponse } from 'next/server';
import { runTitan10 } from '@/lib/agents/titan10';
import { notifyCritical } from '@/lib/agents/titan10/ceo';

export const maxDuration = 300; // 5 min Vercel function timeout

export async function GET(req: NextRequest) {
  // Vercel cron auth
  const authHeader = req.headers.get('authorization');
  const secret     = process.env.CRON_SECRET ?? '';
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const hourUTC = new Date().getUTCHours();
  const mode    = hourUTC === 6 ? 'FULL_PIPELINE' : 'SURVEILLANCE';

  try {
    const result = await runTitan10(mode);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    await notifyCritical('Cron/Titan10', `Cron dispatcher failed at hour ${hourUTC}`, err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
