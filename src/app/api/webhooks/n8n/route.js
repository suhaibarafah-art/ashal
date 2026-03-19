import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ── Auth Validation ──────────────────────────────────────────────────────────
function validateSecret(request) {
  const secret = request.headers.get('x-n8n-secret');
  const expected = process.env.N8N_TO_NEXTJS_SECRET;
  if (!expected) return false;
  // Constant-time comparison to prevent timing attacks
  if (secret?.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= secret.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

// ── Payload Validator ────────────────────────────────────────────────────────
function validateProductPayload(data) {
  const required = ['titleAr', 'titleEn', 'sellingPrice', 'slug'];
  const missing = required.filter(k => !data[k]);
  if (missing.length > 0) throw new Error(`Missing required fields: ${missing.join(', ')}`);
  if (typeof data.sellingPrice !== 'number' || data.sellingPrice <= 0) throw new Error('Invalid sellingPrice');
  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) throw new Error('Invalid slug format');
}

// ── Upsert Product ───────────────────────────────────────────────────────────
async function upsertProduct(data) {
  const existingBySlug = await prisma.product.findUnique({ where: { slug: data.slug } }).catch(() => null);
  const existingBySku = data.supplierSku
    ? await prisma.supplierProductLink.findFirst({ where: { supplierSku: data.supplierSku } }).catch(() => null)
    : null;

  const productData = {
    slug: existingBySlug ? `${data.slug}-${Date.now().toString(36)}` : data.slug,
    titleAr: data.titleAr,
    titleEn: data.titleEn,
    shortDescAr: data.shortDescAr || null,
    shortDescEn: data.shortDescEn || null,
    descAr: data.descAr || null,
    descEn: data.descEn || null,
    bulletsAr: data.bulletsAr || [],
    bulletsEn: data.bulletsEn || [],
    sellingPrice: data.sellingPrice,
    comparePrice: data.comparePrice || null,
    costPrice: data.costPrice || null,
    stock: data.stock || 50,
    leadTimeDays: data.leadTimeDays || 7,
    isActive: false,   // Always draft — admin must review before going live
    isFeatured: false,
    codEnabled: data.codEnabled !== false,
    metaTitleAr: data.metaTitleAr || null,
    metaTitleEn: data.metaTitleEn || null,
    metaDescAr: data.metaDescAr || null,
    metaDescEn: data.metaDescEn || null,
  };

  let product;

  if (existingBySku?.productId) {
    // Update existing linked product
    product = await prisma.product.update({
      where: { id: existingBySku.productId },
      data: productData,
    });
  } else {
    // Create new product with images
    product = await prisma.product.create({
      data: {
        ...productData,
        images: data.images?.length
          ? {
              create: data.images.slice(0, 8).map((url, i) => ({
                url,
                isPrimary: i === 0,
                sortOrder: i,
              })),
            }
          : undefined,
      },
    });
  }

  // Link to supplier if provided
  if (data.supplierId && data.supplierSku && !existingBySku) {
    await prisma.supplierProductLink.create({
      data: {
        productId: product.id,
        supplierId: data.supplierId,
        supplierSku: data.supplierSku,
        costPrice: data.costPrice || data.sellingPrice,
        leadTimeDays: data.leadTimeDays || 7,
      },
    }).catch(() => { /* Ignore duplicate link errors */ });
  }

  return product;
}

// ── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(request) {
  // 1. Auth check
  if (!validateSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // 2. Support both single product and batch array
  const products = Array.isArray(body) ? body : body.products ? body.products : [body];

  if (products.length === 0) {
    return NextResponse.json({ error: 'Empty products array' }, { status: 400 });
  }

  if (products.length > 50) {
    return NextResponse.json({ error: 'Batch limit is 50 products per request' }, { status: 400 });
  }

  // 3. Process each product
  const results = { success: [], failed: [] };

  for (const productData of products) {
    try {
      validateProductPayload(productData);
      const product = await upsertProduct(productData);
      results.success.push({ productId: product.id, slug: product.slug, titleAr: product.titleAr });
    } catch (err) {
      results.failed.push({
        slug: productData.slug || 'unknown',
        titleAr: productData.titleAr || 'unknown',
        error: err.message,
      });
      console.error(`[n8n webhook] Failed to upsert product "${productData.titleAr}":`, err.message);
    }
  }

  const status = results.failed.length === products.length ? 422 : 200;

  return NextResponse.json({
    success: results.success.length > 0,
    processed: products.length,
    inserted: results.success.length,
    failed: results.failed.length,
    results,
    note: 'All products created as drafts (isActive: false). Review in admin before publishing.',
    timestamp: new Date().toISOString(),
  }, { status });
}

// ── GET — Health check for n8n to verify webhook is alive ───────────────────
export async function GET(request) {
  if (!validateSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({
    status: 'ok',
    webhook: 'n8n → Next.js bridge operational',
    timestamp: new Date().toISOString(),
  });
}
