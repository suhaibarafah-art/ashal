import { NextResponse } from 'next/server';
import { AdsEngine } from '@/lib/ads-engine';

export async function GET() {
  const result = await AdsEngine.launchAutonomousCampaign();
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    campaign: result
  });
}
