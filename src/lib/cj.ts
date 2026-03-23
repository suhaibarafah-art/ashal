/**
 * CJ Dropshipping auth utility
 * Priority order:
 * 1. SiteSetting DB key 'cj_access_token' (set via /api/sys/cj-token)
 * 2. Auto-authenticate using CJ_EMAIL + CJ_API_KEY env vars
 * 3. CJ_ACCESS_TOKEN env var fallback
 */

import { prisma } from '@/lib/prisma';

let _cachedToken: string | null = null;
let _tokenExpiry: number = 0;

export async function getCJToken(): Promise<string> {
  // Return cached token if still valid (with 1h buffer)
  if (_cachedToken && Date.now() < _tokenExpiry) return _cachedToken;

  // 1. Try SiteSetting DB (most reliable — bypasses Vercel env issues)
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: 'cj_access_token' } });
    if (row?.value) {
      _cachedToken = row.value;
      _tokenExpiry = Date.now() + 60 * 60 * 1000; // 1h cache
      return row.value;
    }
  } catch { /* table might not exist yet */ }

  const email  = process.env.CJ_EMAIL ?? '';
  const apiKey = (process.env.CJ_API_KEY ?? '').split('@api@')[1] ?? '';

  // 2. Auto-authenticate using email + apiKey
  if (email && apiKey) {
    const res  = await fetch('https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, apiKey }),
    });
    const data = await res.json();
    const token: string = data?.data?.accessToken ?? '';
    if (token) {
      // Store in DB for next time
      try {
        await prisma.siteSetting.upsert({
          where:  { key: 'cj_access_token' },
          create: { key: 'cj_access_token', value: token },
          update: { value: token },
        });
      } catch { /* non-blocking */ }

      _cachedToken = token;
      _tokenExpiry = Date.now() + 14 * 24 * 60 * 60 * 1000;
      return token;
    }
    // If auth fails, fall through to stored token
  }

  // 3. Fallback to env var stored token
  const stored = process.env.CJ_ACCESS_TOKEN ?? '';
  if (stored) {
    _cachedToken = stored;
    _tokenExpiry = Date.now() + 60 * 60 * 1000;
    return stored;
  }

  throw new Error('CJ credentials not configured (set cj_access_token via /api/sys/cj-token)');
}

export async function cjFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = await getCJToken();
  return fetch(`https://developers.cjdropshipping.com/api2.0/v1${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'CJ-Access-Token': token,
      ...(options.headers ?? {}),
    },
  });
}
