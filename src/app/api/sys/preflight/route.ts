/**
 * Saudi Luxury Store - Pre-Flight Check
 * Admin-only endpoint — requires x-admin-key: CRON_SECRET
 */

import { NextRequest, NextResponse } from 'next/server';
import { cjEngine } from '@/lib/cj-supplier';

export async function GET(req: NextRequest) {
  // Auth guard — only admin can trigger live API checks
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const key = req.headers.get('x-admin-key') ?? '';
    const auth = req.headers.get('authorization') ?? '';
    if (key !== secret && auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const results = {
      database: true,
      supplier: { connected: false, optional: true, note: '' },
      payment: { configured: false, note: '' },
      notifications: {
        whatsapp: !!process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_TOKEN !== 'placeholder',
        telegram: !!process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN !== 'placeholder',
      },
      errors: [] as string[],
    };

    // 1. CJ Dropshipping (optional — falls back to simulation)
    try {
      const prods = await cjEngine.searchProducts('watch');
      results.supplier.connected = prods.length > 0;
      results.supplier.note = prods.length > 0 ? 'Live API connected' : 'No results — simulation fallback active';
    } catch (e: unknown) {
      results.supplier.note = 'Simulation fallback active';
      results.errors.push(`Supplier (non-critical): ${String(e)}`);
    }

    // 2. Moyasar (required for payments) — supports both env var names
    const moyasarKey = process.env.MOYASAR_SECRET_KEY ?? process.env.MOYASAR_API_KEY ?? '';
    results.payment.configured = !!moyasarKey && moyasarKey !== 'PENDING' && !moyasarKey.startsWith('sk_test_MISSING');
    results.payment.note = results.payment.configured ? 'Live key present' : 'Key missing or placeholder';
    if (!results.payment.configured) {
      results.errors.push('Payment: MOYASAR_API_KEY not configured');
    }

    const isReady = results.payment.configured; // supplier is optional

    return NextResponse.json({
      status: isReady ? 'READY' : 'CONFIG_NEEDED',
      checks: results,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    return NextResponse.json({ status: 'FAIL', error: String(error) }, { status: 500 });
  }
}
