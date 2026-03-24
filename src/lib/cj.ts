/**
 * CJ Dropshipping auth utility
 * Auto-authenticates using CJ_EMAIL + CJ_API_KEY — no manual token management needed.
 * Falls back to CJ_ACCESS_TOKEN if credentials are missing.
 */

let _cachedToken: string | null = null;
let _tokenExpiry: number = 0;

export async function getCJToken(): Promise<string> {
  // Return cached token if still valid (with 1h buffer)
  if (_cachedToken && Date.now() < _tokenExpiry) return _cachedToken;

  const email  = process.env.CJ_EMAIL ?? '';
  const apiKey = (process.env.CJ_API_KEY ?? '').split('@api@')[1] ?? '';

  // If we have credentials → always re-auth
  if (email && apiKey) {
    const res  = await fetch('https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, apiKey }),
    });
    const data = await res.json();
    const token: string = data?.data?.accessToken ?? '';
    if (!token) {
      console.warn(`[CJ] Auth failed: ${data?.message} — falling back to stored token`);
      const stored = process.env.CJ_ACCESS_TOKEN ?? '';
      return stored; // empty string → caller handles gracefully
    }

    _cachedToken = token;
    _tokenExpiry = Date.now() + 14 * 24 * 60 * 60 * 1000; // cache 14 days
    return token;
  }

  // Fallback to stored token
  const stored = process.env.CJ_ACCESS_TOKEN ?? '';
  return stored; // empty string → caller handles gracefully
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
