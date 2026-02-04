#!/bin/bash
# Final backend deployment after database ID is set

echo "🗄️ Initializing database schema..."
wrangler d1 execute theopublic-tasks --file=./api/schema.sql

echo "🚀 Deploying Worker..."
wrangler deploy

echo ""
echo "✅ Backend deployed!"
echo "Copy the Worker URL above (ends in .workers.dev)"
echo "Then tell Theo to update the frontend"
