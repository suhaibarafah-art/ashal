#!/bin/bash
# ══════════════════════════════════════════════════════
# ASHAL — Railway One-Click Setup
# Run this AFTER: railway login
# Usage: bash scripts/railway-setup.sh
# ══════════════════════════════════════════════════════

set -e

echo "🚂 Setting up ASHAL on Railway..."

# ── 1. Create project ─────────────────────────────────
echo ""
echo "📦 Creating Railway project..."
railway init --name ashal-backend 2>/dev/null || echo "Project may already exist"

# ── 2. Get project ID ─────────────────────────────────
PROJECT_ID=$(railway status --json 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('projectId',''))" 2>/dev/null || echo "")

# ── 3. Deploy n8n service ─────────────────────────────
echo ""
echo "🔧 Creating n8n service..."
cd n8n-docker

railway service create n8n-service 2>/dev/null || true
railway link --service n8n-service 2>/dev/null || true

# Set n8n environment variables
railway variables set \
  N8N_BASIC_AUTH_ACTIVE=true \
  N8N_BASIC_AUTH_USER=admin \
  N8N_BASIC_AUTH_PASSWORD=$(openssl rand -hex 16) \
  N8N_ENCRYPTION_KEY=9f3cd0aa1a2e0b6a1c79803960d20b36043f58f5afd921d05570450c5fb8036b \
  DB_TYPE=sqlite \
  N8N_USER_FOLDER=/home/node/.n8n \
  EXECUTIONS_DATA_PRUNE=true \
  EXECUTIONS_DATA_MAX_AGE=168 \
  GENERIC_TIMEZONE=Asia/Riyadh \
  TZ=Asia/Riyadh \
  --service n8n-service 2>/dev/null

railway up --service n8n-service --detach 2>/dev/null
echo "✅ n8n deploying..."

cd ..

# ── 4. Deploy agent-worker service ───────────────────
echo ""
echo "🤖 Creating agent-worker service..."
railway service create agent-worker 2>/dev/null || true
railway link --service agent-worker 2>/dev/null || true

# Set agent environment variables
railway variables set \
  GEMINI_API_KEY=REPLACE_WITH_YOUR_GEMINI_KEY \
  N8N_TO_NEXTJS_SECRET=a21a70265397073280285ba2a2d94a0b3f7c23a8e7a8b27106049359d93b1ba1 \
  NEXTJS_WEBHOOK_URL=https://ashal.vercel.app/api/webhooks/n8n \
  RAILWAY_AGENT_SECRET=3c659dc4f7b50239c3efa55a5ac910cc873446b169ad1f94e3acba0fabf01896 \
  AGENT_MAX_PRODUCTS=15 \
  AGENT_MIN_SCORE=50 \
  AGENT_DRY_RUN=false \
  --service agent-worker 2>/dev/null

railway up --service agent-worker --detach 2>/dev/null
echo "✅ Agent worker deploying..."

# ── 5. Get Railway Token for GitHub Actions ───────────
echo ""
echo "🔑 Getting Railway token for GitHub Actions..."
RAILWAY_TOKEN=$(railway whoami --token 2>/dev/null || echo "")

if [ -n "$RAILWAY_TOKEN" ]; then
  echo "Setting RAILWAY_TOKEN in GitHub Actions..."
      gh secret set RAILWAY_TOKEN --body "$RAILWAY_TOKEN" --repo suhaibarafah-art/ashal
  echo "✅ RAILWAY_TOKEN set in GitHub secrets"
else
  echo "⚠️  Could not auto-get token."
  echo "   Go to: https://railway.app/account/tokens"
  echo "   Create a token and run:"
  echo "   gh secret set RAILWAY_TOKEN --body YOUR_TOKEN --repo suhaibarafah-art/ashal"
fi

# ── 6. Get n8n URL ────────────────────────────────────
echo ""
echo "📡 Getting n8n deployment URL..."
N8N_URL=$(railway domain --service n8n-service 2>/dev/null || echo "")
if [ -n "$N8N_URL" ]; then
  echo "✅ n8n URL: https://$N8N_URL"
  echo "   Set this in GitHub: N8N_URL=https://$N8N_URL"
  gh secret set N8N_URL --body "https://$N8N_URL" --repo suhaibarafah-art/ashal 2>/dev/null || true
fi

# ── Done ──────────────────────────────────────────────
echo ""
echo "══════════════════════════════════════════════"
echo "✅ ASHAL Railway setup complete!"
echo ""
echo "Next steps:"
echo "1. Wait ~2 min for services to boot"
echo "2. Open Railway dashboard: https://railway.app"
echo "3. Get your n8n URL from the dashboard"
echo "4. Update NEXTJS_WEBHOOK_URL after Vercel deploy"
echo "5. Add GEMINI_API_KEY to Railway agent-worker vars"
echo "══════════════════════════════════════════════"
