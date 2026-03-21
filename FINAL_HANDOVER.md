# FINAL HANDOVER — Saudi Luxury Store
## 8-Phase Full-Stack System Lock — Complete

---

## System Architecture

```
Customer Browser
      │
      ├── / (Homepage)          → Server: fetch products from DB → HomeClient (framer-motion grid)
      ├── /products/[id]        → Server: product detail + shipping tag + coupon field
      ├── /checkout/[id]        → Server + CheckoutClient:
      │       Step 1: name/phone/city/address + coupon → POST /api/orders
      │       Step 2: Moyasar hosted form (real payment)
      │       Step 3: redirect → /orders/[id]
      ├── /orders/[id]          → Order tracking stepper (PENDING→PAID→SHIPPED→DELIVERED)
      ├── /admin                → Admin dashboard (KPIs + recent orders + logs)
      ├── /admin/war-room       → Titan-5 heartbeats + social kit + inventory + revenue
      └── /admin/system-logs    → Stealth log viewer (no Telegram/Email)

API Routes
      ├── POST /api/orders              → create order, validate coupon, return Moyasar payload
      ├── GET  /api/orders              → list orders for admin
      ├── POST /api/coupons             → validate coupon code
      ├── POST /api/webhooks/moyasar    → Moyasar webhook (HMAC-SHA256) → mark PAID → automation
      ├── GET  /api/products/sync       → list products
      ├── POST /api/products/sync       → sync from CJ/Mkhazen
      ├── POST /api/agents/run          → trigger Titan-5 full run
      ├── GET  /api/agents/run          → list agent logs
      └── GET/POST /api/sys/logs        → stealth system log write/read
```

---

## Phase Completion Summary

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | ✅ Done | Color lock: #FF8C00 Orange, #002366 Royal Blue, #FFDB58 Mustard |
| 2 | ✅ Done | Master Link Audit — all routes use prisma singleton, HMAC webhook |
| 3 | ✅ Done | Titan-5 Agents: Scout + Copywriter + Critic + Strategist + CEO |
| 4 | ✅ Done | Prisma generate + db push + VIP15 coupon seeded |
| 5 | ✅ Done | Real Moyasar checkout (2-step: info → payment form) |
| 6 | ✅ Done | Admin War Room: heartbeats, social kits, inventory table |
| 7 | ✅ Done | Performance: image domains, CSP, cache headers, viewport |
| 8 | ✅ Done | Shadow Run (tsc clean) + FINAL_HANDOVER.md + MISSING_KEYS.txt |

---

## Titan-5 Agent System

Located at: `src/lib/agents/titan5.ts`

| Agent | Source | Role |
|-------|--------|------|
| **Scout** | mkhazen/CJ catalogue | Upserts 8 products into DB on each run |
| **Copywriter** | Gemini API (or fallback) | Enhances Arabic product descriptions |
| **Critic** | Internal audit | Scores image/desc/price completeness (0-100%) |
| **Strategist** | DB data | Generates Instagram/Twitter/WhatsApp social kits |
| **CEO** | All agent results | Logs health status (GREEN/YELLOW/RED) to Neon |

Trigger: `POST /api/agents/run` or via War Room UI

---

## Coupon Engine

| Code | Discount | Max Uses |
|------|----------|----------|
| SAVE10 | 10% | 10,000 |
| ROYAL20 | 20% | 1,000 |
| VIP15 | 15% | 500 |

Applied in: `src/lib/pricing-engine.ts` → `applyCoupon()`
Validated in: `POST /api/coupons` (checks DB isActive + usageCount)

---

## Payment Flow (Moyasar)

1. Customer fills checkout form → `POST /api/orders` → creates `PENDING` order in DB
2. Server returns `orderId` + `amountHalalas` + `moyasarKey`
3. `CheckoutClient` loads Moyasar JS from CDN, inits with orderId in metadata
4. Customer pays via Visa/Mada/STC Pay/Apple Pay
5. Moyasar fires `POST /api/webhooks/moyasar` (HMAC-SHA256 verified)
6. Webhook: marks order `PAID` → `processOrderAutomation(orderId)`:
   - Submits to CJ API (or simulation fallback)
   - Creates `LogisticBot` record (Aramex Saudi)
   - Updates order to `PAID_AND_ORDERED`
7. Customer redirected to `/orders/[id]` (tracking page)

---

## Design System

```
Colors (CSS vars):
  --color-orange:  #FF8C00  → CTAs, prices, highlights
  --color-blue:    #002366  → Header, nav, footer
  --color-mustard: #FFDB58  → Accents, badges, coupon chips

Fonts:
  Cairo 800     → Arabic text (RTL)
  Montserrat 800 → English/numbers

Key classes:
  .btn-primary    → Orange CTA button
  .btn-secondary  → Blue outline button
  .card-luxury    → White card with shadow
  .kpi-card       → Admin KPI tile
  .input-luxury   → Form input (RTL)
  .tag-shipping-local  → 24-48h 🇸🇦 badge
  .tag-shipping-global → Global badge
```

---

## Database Schema (SQLite dev / Neon PostgreSQL prod)

Key models: `Product`, `Order`, `Coupon`, `SystemLog`, `LogisticBot`, `EInvoiceZATCA`, `PredictiveOracle`, `AIInfluencerCampaign`, `WealthPortfolio`, `ConversationalSession`

Seed coupons: `npx ts-node prisma/seed-coupons.ts`

---

## Go-Live Checklist

- [ ] Set `DATABASE_URL` → Neon PostgreSQL connection string
- [ ] Change `prisma/schema.prisma` provider to `"postgresql"`
- [ ] Run `npx prisma generate && npx prisma db push`
- [ ] Run `npx ts-node prisma/seed-coupons.ts`
- [ ] Set `MOYASAR_WEBHOOK_SECRET` from Moyasar Dashboard
- [ ] Set `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Deploy to Vercel: `vercel --prod`
- [ ] Test: buy product → Moyasar payment → webhook → order status
- [ ] Check `/admin/war-room` → run Titan-5 → verify agent heartbeats

---

*Generated: 2026-03-21 | Saudi Luxury Store — Full-Stack System Lock Complete*
