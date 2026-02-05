#!/bin/bash

##############################################
# THEO DASHBOARD v2.0 - Setup Test
# Verify installation and run tests
##############################################

echo "╔═══════════════════════════════════════╗"
echo "║  THEO DASHBOARD v2.0 - SETUP TEST    ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check Node.js
echo "🔍 Checking Node.js..."
if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
else
  echo -e "${RED}✗${NC} Node.js not found. Please install Node.js 16+."
  exit 1
fi

# Test 2: Check npm
echo "🔍 Checking npm..."
if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm --version)
  echo -e "${GREEN}✓${NC} npm installed: $NPM_VERSION"
else
  echo -e "${RED}✗${NC} npm not found."
  exit 1
fi

# Test 3: Check package.json
echo "🔍 Checking package.json..."
if [ -f "package.json" ]; then
  echo -e "${GREEN}✓${NC} package.json found"
else
  echo -e "${RED}✗${NC} package.json not found"
  exit 1
fi

# Test 4: Check if dependencies are installed
echo "🔍 Checking dependencies..."
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✓${NC} node_modules exists"
else
  echo -e "${YELLOW}⚠${NC} node_modules not found. Installing..."
  npm install
fi

# Test 5: Check .env
echo "🔍 Checking environment configuration..."
if [ -f ".env" ]; then
  echo -e "${GREEN}✓${NC} .env file exists"
else
  echo -e "${YELLOW}⚠${NC} .env not found. Creating from .env.example..."
  cp .env.example .env
  echo -e "${GREEN}✓${NC} .env created (please edit with your settings)"
fi

# Test 6: Check required files
echo "🔍 Checking required files..."
FILES=("server.js" "routes/status.js" "public/index.html" "public/css/style.css" "public/js/app.js")
MISSING=0

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
  else
    echo -e "${RED}✗${NC} $file (MISSING)"
    MISSING=$((MISSING + 1))
  fi
done

if [ $MISSING -gt 0 ]; then
  echo -e "${RED}✗${NC} $MISSING required files missing"
  exit 1
fi

# Test 7: Test API endpoints (if server is running)
echo ""
echo "🔍 Testing API endpoints..."
echo -e "${YELLOW}ℹ${NC} Start server with: npm start"
echo -e "${YELLOW}ℹ${NC} Then run: curl http://localhost:3000/api/status"

# Summary
echo ""
echo "╔═══════════════════════════════════════╗"
echo "║  SETUP VERIFICATION COMPLETE ✅       ║"
echo "╚═══════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Start server: npm start"
echo "3. Visit: http://localhost:3000"
echo ""
echo "For deployment to cPanel:"
echo "  Run: ./deploy.sh"
echo ""
