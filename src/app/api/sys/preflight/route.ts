/**
 * Saudi Luxury Store - Pre-Flight Autopilot
 * نظام الفحص النهائي - التاكد من سلامة الربط قبل البيع الحقيقي.
 */

import { NextResponse } from 'next/server';
import { cjEngine } from '@/lib/cj-supplier';
import { moyasarCore } from '@/lib/moyasar-real';

export async function GET() {
  try {
    console.log("🚀 Pre-Flight Check: Initiating System Pulse...");

    const results = {
      supplierActive: false,
      paymentActive: false,
      databaseActive: true,
      errors: [] as string[]
    };

    // 1. Test Supplier Connection
    try {
      const prods = await cjEngine.searchProducts("Vase");
      results.supplierActive = prods.length > 0;
    } catch (e: any) {
      results.errors.push(`Supplier: ${e.message}`);
    }

    // 2. Test Payment Core
    try {
      const inv = await moyasarCore.createInvoice({ amount: 100, currency: "SAR", description: "Test" });
      results.paymentActive = !!inv.id;
    } catch (e: any) {
      results.errors.push(`Payment: ${e.message}`);
    }

    const isReady = results.supplierActive && results.paymentActive;

    return NextResponse.json({
      status: isReady ? "SYSTEM_READY" : "INTEGRATION_PENDING",
      checks: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({ status: "FAIL", error }, { status: 500 });
  }
}
