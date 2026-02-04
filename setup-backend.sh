#!/bin/bash
# Deploy TheoPublic Backend Script
# Run this in TheoPublic directory

echo "🚀 Deploying TheoPublic Backend..."

# Install wrangler if not present
if ! command -v wrangler &> /dev/null; then
    echo "📦 Installing Wrangler..."
    npm install -g wrangler
fi

# Login to Cloudflare
echo "🔑 Login to Cloudflare (this will open a browser)..."
wrangler login

# Create D1 database
echo "🗄️ Creating D1 database..."
wrangler d1 create theopublic-tasks

echo ""
echo "⚠️  IMPORTANT: Copy the database_id from above!"
echo "Then run: nano wrangler.toml"
echo "Replace YOUR_DATABASE_ID_HERE with the copied ID"
echo ""
echo "Then run: ./deploy-backend.sh"
