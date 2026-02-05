#!/bin/bash

# ============================================
# THEO DASHBOARD v2.0 — DEPLOYMENT SCRIPT
# ============================================

echo "╔═══════════════════════════════════════════╗"
echo "║   THEO DASHBOARD v2.0 — DEPLOYMENT        ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
    echo "❌ Error: Must run from theo-dashboard directory"
    exit 1
fi

# Create deployment package
echo "📦 Creating deployment package..."
zip -r theo-dashboard-$(date +%Y%m%d-%H%M%S).zip \
    . \
    -x "*.git*" \
    -x "node_modules/*" \
    -x "*.zip" \
    -x ".env" \
    -x "logs/*"

echo "✅ Deployment package created!"
echo ""
echo "📤 Upload options:"
echo "  1. SCP: scp theo-dashboard-*.zip pgsvkqjg@198.54.116.221:/home/pgsvkqjg/"
echo "  2. cPanel File Manager"
echo ""
echo "📋 Next steps on server:"
echo "  1. Extract: unzip theo-dashboard-*.zip -d theo/"
echo "  2. Install: cd theo && npm install --production"
echo "  3. Configure: cp .env.example .env && nano .env"
echo "  4. Setup in cPanel: Software → Setup Node.js App"
echo "  5. Start: node server.js"
echo ""
echo "🎯 Target: pgs-ventures.com/theo"
