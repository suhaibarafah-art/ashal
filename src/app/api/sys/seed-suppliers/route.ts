/**
 * POST /api/sys/seed-suppliers
 * Seeds 4 real suppliers into the DB SiteSetting store.
 * Auth: Bearer CRON_SECRET
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const SUPPLIERS = [
  { key: 'supplier_CJ_DROP',    name: 'CJ Dropshipping', type: 'CJ_DROP',    platform: 'CJ',         method: 'API' },
  { key: 'supplier_ALIEXPRESS', name: 'AliExpress',      type: 'ALIEXPRESS',  platform: 'AliExpress', method: 'API/Sim' },
  { key: 'supplier_ZENDROP',    name: 'Zendrop',         type: 'ZENDROP',     platform: 'Zendrop',    method: 'API/Sim' },
  { key: 'supplier_SPOCKET',    name: 'Spocket',         type: 'SPOCKET',     platform: 'Spocket',    method: 'API/Sim' },
];

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results = await Promise.all(
    SUPPLIERS.map(s =>
      prisma.siteSetting.upsert({
        where: { key: s.key },
        create: { key: s.key, value: JSON.stringify(s) },
        update: { value: JSON.stringify(s) },
      })
    )
  );

  return NextResponse.json({ ok: true, seeded: results.length, suppliers: SUPPLIERS.map(s => s.name) });
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows = await prisma.siteSetting.findMany({
    where: { key: { startsWith: 'supplier_' } },
  });

  return NextResponse.json({ suppliers: rows.map(r => JSON.parse(r.value)) });
}
