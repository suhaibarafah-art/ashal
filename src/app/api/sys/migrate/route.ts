/**
 * POST /api/sys/migrate
 * Creates any missing DB tables using raw SQL (since migrate deploy can't run on pooled URLs).
 * Safe to call multiple times — uses CREATE TABLE IF NOT EXISTS.
 * Auth: Bearer CRON_SECRET
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type MigrationStep = { name: string; sql: string };

const MIGRATIONS: MigrationStep[] = [
  {
    name: 'SiteSetting',
    sql: `CREATE TABLE IF NOT EXISTS "SiteSetting" (
      "key"       TEXT NOT NULL,
      "value"     TEXT NOT NULL,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
    )`,
  },
  {
    name: 'SystemLog',
    sql: `CREATE TABLE IF NOT EXISTS "SystemLog" (
      "id"        TEXT NOT NULL,
      "level"     TEXT NOT NULL DEFAULT 'INFO',
      "source"    TEXT NOT NULL,
      "message"   TEXT NOT NULL,
      "metadata"  TEXT NOT NULL DEFAULT '',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "SystemLog_pkey" PRIMARY KEY ("id")
    )`,
  },
  {
    name: 'AgentTaskQueue',
    sql: `CREATE TABLE IF NOT EXISTS "AgentTaskQueue" (
      "id"          TEXT NOT NULL,
      "cjProductId" TEXT NOT NULL,
      "titleEn"     TEXT NOT NULL,
      "titleAr"     TEXT NOT NULL DEFAULT '',
      "descAr"      TEXT NOT NULL DEFAULT '',
      "imageUrl"    TEXT NOT NULL,
      "baseCost"    DOUBLE PRECISION NOT NULL,
      "shippingCost" DOUBLE PRECISION NOT NULL,
      "marginPct"   DOUBLE PRECISION NOT NULL DEFAULT 0,
      "adCopyTikTok" TEXT NOT NULL DEFAULT '',
      "adCopySnap"  TEXT NOT NULL DEFAULT '',
      "adCopyIG"    TEXT NOT NULL DEFAULT '',
      "productId"   TEXT,
      "status"      TEXT NOT NULL DEFAULT 'PENDING_CRITIC',
      "errorLog"    TEXT NOT NULL DEFAULT '',
      "agentNotes"  TEXT NOT NULL DEFAULT '',
      "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "AgentTaskQueue_pkey" PRIMARY KEY ("id")
    )`,
  },
  {
    name: 'DailyReport',
    sql: `CREATE TABLE IF NOT EXISTS "DailyReport" (
      "id"               TEXT NOT NULL,
      "date"             TIMESTAMP(3) NOT NULL,
      "totalRevenue"     DOUBLE PRECISION NOT NULL DEFAULT 0,
      "orderCount"       INTEGER NOT NULL DEFAULT 0,
      "conversionRate"   DOUBLE PRECISION NOT NULL DEFAULT 0,
      "syncSuccess"      INTEGER NOT NULL DEFAULT 0,
      "syncFailed"       INTEGER NOT NULL DEFAULT 0,
      "newProducts"      INTEGER NOT NULL DEFAULT 0,
      "archivedProducts" INTEGER NOT NULL DEFAULT 0,
      "topProductId"     TEXT,
      "topProductTitle"  TEXT NOT NULL DEFAULT '',
      "topProductRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
      "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "DailyReport_pkey" PRIMARY KEY ("id")
    )`,
  },
  {
    name: 'DailyReport_date_idx',
    sql: `CREATE UNIQUE INDEX IF NOT EXISTS "DailyReport_date_key" ON "DailyReport"("date")`,
  },
  {
    name: 'AgentTaskQueue_status_idx',
    sql: `CREATE INDEX IF NOT EXISTS "AgentTaskQueue_status_idx" ON "AgentTaskQueue"("status")`,
  },
  {
    name: 'AgentTaskQueue_cjProductId_idx',
    sql: `CREATE INDEX IF NOT EXISTS "AgentTaskQueue_cjProductId_idx" ON "AgentTaskQueue"("cjProductId")`,
  },
];

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: string[] = [];

  for (const m of MIGRATIONS) {
    try {
      await prisma.$executeRawUnsafe(m.sql);
      results.push(`${m.name}: OK`);
    } catch (e) {
      results.push(`${m.name}: ERROR — ${e}`);
    }
  }

  return NextResponse.json({ ok: true, results });
}
