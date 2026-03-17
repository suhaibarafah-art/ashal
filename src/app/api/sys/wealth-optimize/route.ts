/**
 * Saudi Luxury Store - Wealth optimization API
 */

import { NextResponse } from 'next/server';
import { WealthOptimizer } from '@/lib/wealth-optimizer';

export async function GET() {
  try {
    const report = await WealthOptimizer.optimizeBudgets();
    return NextResponse.json({
      status: "OPTIMIZATION_COMPLETE",
      report,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ status: "FAIL", error }, { status: 500 });
  }
}
