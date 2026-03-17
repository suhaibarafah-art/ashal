/**
 * Saudi Luxury Store - Empire Sync API
 * محرك التوسع الإمبراطوري - تنفيذ جلب الـ 20 منتجاً.
 */

import { NextResponse } from 'next/server';
import { EmpireSeeder } from '@/lib/empire-seeder';

export async function GET() {
  try {
    const count = await EmpireSeeder.seedEmpireCatalog();
    return NextResponse.json({
      status: "EMPIRE_SEED_COMPLETE",
      productsSeeded: count,
      strategy: "Elite Trend Acquisition",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ status: "SEED_FAIL", error }, { status: 500 });
  }
}
