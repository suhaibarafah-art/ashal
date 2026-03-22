/**
 * A/B Variant Telemetry Endpoint
 * POST /api/ab-track
 * Logs which description variant (royal/modern/emotional) was shown or led to Add to Cart.
 * Events are stored in Neon DB (VariantEvent table) for Daily Brief analysis.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const VALID_VARIANTS = new Set(['royal', 'modern', 'emotional']);
const VALID_EVENTS   = new Set(['view', 'add_to_cart']);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, productId, variantKey, event } = body as Record<string, string>;

    // Validate
    if (!sessionId || !productId || !VALID_VARIANTS.has(variantKey) || !VALID_EVENTS.has(event)) {
      return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
    }

    // Rate-limit: one "view" per session+product (duplicates are fine for add_to_cart)
    if (event === 'view') {
      const existing = await prisma.variantEvent.findFirst({
        where: { sessionId, productId, event: 'view' },
        select: { id: true },
      });
      if (existing) {
        return NextResponse.json({ ok: true, skipped: true });
      }
    }

    await prisma.variantEvent.create({
      data: { sessionId, productId, variantKey, event },
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Telemetry must never break the storefront
    return NextResponse.json({ ok: true, warn: 'logged_silently' });
  }
}
