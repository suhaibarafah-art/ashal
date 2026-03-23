/**
 * GET  /api/sys/cj-token  — returns stored token info (preview, tail, length, expiry)
 * POST /api/sys/cj-token  — stores a new CJ token in the DB SiteSetting
 *
 * Auth: Bearer CRON_SECRET
 * This bypasses the Vercel env var issue — token lives in Neon DB.
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function requireAuth(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // dev mode
  const auth = req.headers.get('authorization');
  return auth === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!requireAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const row = await prisma.siteSetting.findUnique({ where: { key: 'cj_access_token' } });
  if (!row) return NextResponse.json({ stored: false, message: 'No CJ token stored in DB' });

  const token = row.value;
  const expiry = await prisma.siteSetting.findUnique({ where: { key: 'cj_token_expiry' } });

  return NextResponse.json({
    stored: true,
    length: token.length,
    preview: token.slice(0, 20) + '...',
    tail: token.slice(-10),
    expiresAt: expiry?.value ?? 'unknown',
  });
}

export async function POST(req: NextRequest) {
  if (!requireAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json() as { token?: string };

  if (!body.token) {
    return NextResponse.json({ error: 'token field required' }, { status: 400 });
  }

  const token = body.token.trim();
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

  await Promise.all([
    prisma.siteSetting.upsert({
      where: { key: 'cj_access_token' },
      create: { key: 'cj_access_token', value: token },
      update: { value: token },
    }),
    prisma.siteSetting.upsert({
      where: { key: 'cj_token_expiry' },
      create: { key: 'cj_token_expiry', value: expiresAt },
      update: { value: expiresAt },
    }),
  ]);

  return NextResponse.json({
    ok: true,
    length: token.length,
    tail: token.slice(-10),
    expiresAt,
  });
}
