import { NextResponse } from 'next/server';

/**
 * Keep-Alive Heartbeat
 * وظيفة نبض الحياة - تمنع السيرفر من الخمود وتضمن استجابة فورية.
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    console.log(`📡 Keep-Alive: Pinging ${baseUrl}...`);
    // Self-ping to keep the function warm
    await fetch(`${baseUrl}/api/cron/sync-trends`);
    
    return NextResponse.json({
      status: "SOVEREIGN_AWAKE",
      timestamp: new Date().toISOString(),
      message: "الكيان في حالة استنفار كامل. لا يوجد خمود."
    });
  } catch (error) {
    return NextResponse.json({ status: "PING_FAILED", error: String(error) }, { status: 500 });
  }
}
