/**
 * POST /api/sys/migrate
 * Creates any missing DB tables using raw SQL (since migrate deploy can't run on pooled URLs).
 * Safe to call multiple times — uses CREATE TABLE IF NOT EXISTS.
 * Auth: Bearer CRON_SECRET
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: string[] = [];

  try {
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "SiteSetting" (
        "key"       TEXT NOT NULL,
        "value"     TEXT NOT NULL,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
      )
    `;
    results.push('SiteSetting: OK');
  } catch (e) {
    results.push(`SiteSetting: ERROR — ${e}`);
  }

  return NextResponse.json({ ok: true, results });
}
