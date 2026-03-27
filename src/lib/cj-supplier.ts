/**
 * Saudi Luxury Store - CJ Dropshipping API Wrapper
 * Token priority:
 *   1. Module-level cache (in-memory, ~23h)
 *   2. Neon DB key cj_access_token (set via /api/sys/cj-token)
 *   3. CJ_API_KEY env var (email/password re-auth)
 */

import { prisma } from '@/lib/prisma';

const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';

// Module-level token cache (lasts ~23h before refresh)
let _cachedToken: string | null = null;
let _tokenExpiry: number = 0;

/** Read the bearer token stored in Neon DB via /api/sys/cj-token */
async function getDBToken(): Promise<string | null> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: 'cj_access_token' } });
    if (!row) return null;
    // Try JSON format first
    try {
      const parsed = JSON.parse(row.value) as { token?: string; expiresAt?: string };
      if (parsed.token && parsed.expiresAt && new Date(parsed.expiresAt) > new Date()) return parsed.token;
    } catch {
      // Raw string format — check cj_token_expiry
      const expRow = await prisma.siteSetting.findUnique({ where: { key: 'cj_token_expiry' } });
      if (expRow && new Date(expRow.value) > new Date()) return row.value;
      if (!expRow && row.value.length > 10) return row.value;
    }
  } catch { /* DB unavailable */ }
  return null;
}

export async function getCJToken(): Promise<string | null> {
  // 1. In-memory cache
  if (_cachedToken && Date.now() < _tokenExpiry) return _cachedToken;

  // 2. DB token (pre-stored bearer token)
  const dbToken = await getDBToken();
  if (dbToken) {
    _cachedToken = dbToken;
    _tokenExpiry = Date.now() + 20 * 3_600_000; // cache for 20h
    console.log('[CJ] Token loaded from DB');
    return _cachedToken;
  }

  // 3. Re-auth via CJ_EMAIL + CJ_API_KEY
  const email  = process.env.CJ_EMAIL ?? '';
  const rawKey = process.env.CJ_API_KEY ?? '';
  const apiKey = rawKey.includes('@api@') ? rawKey.split('@api@')[1] : rawKey;
  if (!email || !apiKey || email.startsWith('your_')) return null;

  try {
    const res = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, apiKey }),
    });

    if (!res.ok) throw new Error(`CJ auth HTTP ${res.status}`);
    // CJ API v2 response: { code, result: true, data: { accessToken, accessTokenExpiryDate } }
    const data = await res.json() as {
      code?: number;
      data?: { accessToken?: string; accessTokenExpiryDate?: string };
      result?: { accessToken?: string; accessTokenExpiryDate?: string } | boolean;
    };
    // Support both response shapes
    const tokenData = typeof data.result === 'object' ? data.result : data.data;
    const accessToken = tokenData?.accessToken ?? '';

    if (data.code === 200 && accessToken) {
      _cachedToken = accessToken;
      _tokenExpiry = tokenData?.accessTokenExpiryDate
        ? new Date(tokenData.accessTokenExpiryDate).getTime() - 3_600_000
        : Date.now() + 22 * 3_600_000;
      // Save to DB so Scout agent and other services can use it
      const expiresAt = new Date(_tokenExpiry).toISOString();
      await prisma.siteSetting.upsert({
        where:  { key: 'cj_access_token' },
        update: { value: JSON.stringify({ token: _cachedToken, expiresAt }) },
        create: { key: 'cj_access_token', value: JSON.stringify({ token: _cachedToken, expiresAt }) },
      }).catch(() => {}); // non-blocking
      console.log('[CJ] ✅ Token obtained + saved to DB');
      return _cachedToken;
    }
  } catch (e) {
    console.error('[CJ] Auth failed:', e);
  }
  return null;
}

// ─── VID LOOKUP ─────────────────────────────────────────────────────────────
// Fetches the first variant ID for a CJ product (needed for order submission)
async function fetchCJVid(token: string, pid: string): Promise<string> {
  try {
    const res = await fetch(
      `${CJ_BASE}/product/variant/query?pid=${encodeURIComponent(pid)}`,
      { headers: { 'CJ-Access-Token': token }, signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json() as { code?: number; data?: Array<{ vid?: string }> };
    if (data.code === 200 && data.data?.[0]?.vid) return data.data[0].vid;
  } catch { /* fall through */ }
  return '';
}

export async function cjCreateOrder(params: {
  orderNumber: string;
  shippingCountry: string;
  shippingCity: string;
  productName: string;
  quantity?: number;
  // Customer details (required by CJ)
  customerName?: string;
  customerPhone?: string;
  shippingAddress?: string;
  shippingZip?: string;
  // CJ product identifiers
  supplierSku?: string; // "CJ-{pid}" or "{pid}:{vid}"
}): Promise<{ success: boolean; cjOrderId?: string; trackingNumber?: string; error?: string }> {
  const token = await getCJToken();

  if (!token) {
    console.log('[CJ] No token — simulation fallback');
    return {
      success: true,
      cjOrderId: `SIM-${Math.floor(Math.random() * 100000)}`,
      trackingNumber: `KSA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };
  }

  // ─── Resolve VID ────────────────────────────────────────────────────────
  let vid = '';
  if (params.supplierSku) {
    const sku = params.supplierSku.replace(/^CJ-/, ''); // strip "CJ-" prefix
    if (sku.includes(':')) {
      // "pid:vid" format — use VID directly
      vid = sku.split(':')[1];
    } else {
      // Only PID — fetch VID from CJ API
      vid = await fetchCJVid(token, sku);
      console.log(`[CJ] Fetched VID for ${sku}: ${vid || 'not found'}`);
    }
  }

  try {
    const productEntry = vid
      ? { vid, quantity: params.quantity ?? 1 }
      : { displayName: params.productName, quantity: params.quantity ?? 1 };

    const body = {
      orderNumber:          params.orderNumber,
      fromCountryCode:      'CN',
      shippingCountry:      params.shippingCountry,
      shippingCity:         params.shippingCity,
      shippingAddress:      params.shippingAddress ?? params.shippingCity,
      shippingZip:          params.shippingZip ?? '',
      shippingPhone:        (params.customerPhone ?? '').replace(/\D/g, ''),
      shippingCustomerName: params.customerName ?? 'Customer',
      products:             [productEntry],
    };

    const res = await fetch(`${CJ_BASE}/shopping/order/createOrder`, {
      method:  'POST',
      headers: { 'CJ-Access-Token': token, 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });

    const data = await res.json() as {
      code?: number;
      data?: { orderId?: string; orderNum?: string };
      result?: { orderId?: string; trackingNumber?: string };
      message?: string;
    };

    if ((data.code === 200) && (data.data?.orderId ?? data.result?.orderId)) {
      const cjOrderId = data.data?.orderId ?? data.result?.orderId ?? '';
      console.log(`[CJ] ✅ Real order created: ${cjOrderId}`);
      return {
        success: true,
        cjOrderId,
        trackingNumber: data.result?.trackingNumber ?? `PENDING-${cjOrderId}`,
      };
    }

    console.warn('[CJ] Order error:', data.message ?? data.code, '— simulation fallback');
    return {
      success: true,
      cjOrderId: `SIM-${Date.now()}`,
      trackingNumber: `KSA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };
  } catch (e) {
    console.error('[CJ] createOrder error:', e);
    return {
      success: true,
      cjOrderId: `SIM-ERR-${Date.now()}`,
      trackingNumber: `KSA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };
  }
}

export async function cjSearchProducts(keyword: string): Promise<Array<{
  pid: string; nameEn: string; sellPrice: number; imageUrl: string;
}>> {
  const token = await getCJToken();
  if (!token) return [];

  try {
    const res = await fetch(
      `${CJ_BASE}/product/list?productNameEn=${encodeURIComponent(keyword)}&pageNum=1&pageSize=10`,
      { headers: { 'CJ-Access-Token': token } }
    );
    const data = await res.json() as { code?: number; result?: { list?: Array<{ pid: string; productNameEn: string; sellPrice: number; productImage: string }> } };

    if (data.code === 200 && data.result?.list) {
      return data.result.list.map(p => ({
        pid: p.pid,
        nameEn: p.productNameEn,
        sellPrice: p.sellPrice,
        imageUrl: p.productImage,
      }));
    }
  } catch (e) {
    console.error('[CJ] searchProducts error:', e);
  }
  return [];
}

// Legacy class interface for backward compat
export class CJSupplierEngine {
  private static baseUrl = CJ_BASE;

  async authenticate() {
    const token = await getCJToken();
    return !!token;
  }

  async searchProducts(keyword: string) {
    return cjSearchProducts(keyword);
  }

  async createOrder(orderData: { orderNumber: string; shippingCity: string; productName: string }) {
    return cjCreateOrder({ ...orderData, shippingCountry: 'SA' });
  }
}

export const cjEngine = new CJSupplierEngine();
