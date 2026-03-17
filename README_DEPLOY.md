# 🇸🇦 Zero-Touch Cloud Deployment - Saudi Luxury Store 2026

Your business is ready for the cloud. Follow these steps to launch your permanent, self-sustaining money machine on Vercel.

## 1. Environment Variables (Critical)
Set these in your [Vercel Dashboard](https://vercel.com/dashboard):
- `DATABASE_URL`: `file:./dev.db` (For autonomous SQLite demo)
- `GEMINI_API_KEY`: Your Google AI Key for the live concierge.
- `MOYASAR_API_KEY`: Your live Moyasar payment key.
- `SUPPLIER_API_KEY`: For real-time CJ/Zendrop syncing.

## 2. Zero-Touch Launch
1. Connect your GitHub repository to Vercel.
2. Vercel will automatically detect the `vercel.json` and `package.json`.
3. The `postinstall` script will generate the Prisma Client.
4. The `build` script will finalize the 2026 Editorial Store.

## 3. Autonomous 24/7 Engine
- **Cron Jobs**: Vercel will automatically activate the 30-minute market scans defined in `/api/cron/sync-trends`.
- **Self-Healing**: The system will monitor its own health and attempt repairs via internal diagnostic loops.

**Your business is now an Always-On sovereign entity.**
