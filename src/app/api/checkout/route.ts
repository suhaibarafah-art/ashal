/**
 * /api/checkout — deprecated stub
 * Actual flow: POST /api/orders (order creation) → /api/payments/* (payment routing)
 */
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Use /api/orders to create an order, then /api/payments/* for payment routing.' },
    { status: 410 }
  );
}
