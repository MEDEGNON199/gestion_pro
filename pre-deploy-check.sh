#!/bin/bash

echo "🔍 TaskFlow Pre-Deployment Checklist"
echo "====================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Function to check
check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $2"
        ((FAILED++))
    fi
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

echo "📦 Checking Backend..."
echo "---------------------"

# Check if backend directory exists
if [ -d "taskflow-api" ]; then
    check 0 "Backend directory exists"
    
    # Check package.json
    if [ -f "taskflow-api/package.json" ]; then
        check 0 "package.json found"
        
        # Check required scripts
        if grep -q '"start:prod"' taskflow-api/package.json; then
            check 0 "start:prod script exists"
        else
            check 1 "start:prod script missing"
        fi
        
        if grep -q '"build"' taskflow-api/package.json; then
            check 0 "build script exists"
        else
            check 1 "build script missing"
        fi
    else
        check 1 "package.json not found"
    fi
    
    # Check .env.example
    if [ -f "taskflow-api/.env.production.example" ]; then
        check 0 ".env.production.example exists"
    else
        warn ".env.production.example not found (recommended)"
    fi
    
    # Check main.ts
    if [ -f "taskflow-api/src/main.ts" ]; then
        check 0 "main.ts exists"
        
        # Check CORS configuration
        if grep -q "enableCors" taskflow-api/src/main.ts; then
            check 0 "CORS configured"
        else
            warn "CORS not configured (may cause issues)"
        fi
    else
        check 1 "main.ts not found"
    fi
    
    # Check health endpoint
    if [ -f "taskflow-api/src/health/health.controller.ts" ] || grep -r "health" taskflow-api/src/ > /dev/null 2>&1; then
        check 0 "Health endpoint exists"
    else
        warn "Health endpoint not found (recommended for Render)"
    fi
    
else
    check 1 "Backend directory not found"
fi

echo ""
echo "🎨 Checking Frontend..."
echo "----------------------"

# Check if frontend directory exists
if [ -d "taskflow-frontend" ]; then
    check 0 "Frontend directory exists"
    
    # Check package.json
    if [ -f "taskflow-frontend/package.json" ]; then
        check 0 "package.json found"
        
        # Check required scripts
        if grep -q '"build"' taskflow-frontend/package.json; then
            check 0 "build script exists"
        else
            check 1 "build script missing"
        fi
    else
        check 1 "package.json not found"
    fi
    
    # Check .env.example
    if [ -f "taskflow-frontend/.env.production.example" ]; then
        check 0 ".env.production.example exists"
    else
        warn ".env.production.example not found (recommended)"
    fi
    
    # Check vite.config
    if [ -f "taskflow-frontend/vite.config.ts" ] || [ -f "taskflow-frontend/vite.config.js" ]; then
        check 0 "Vite config exists"
    else
        check 1 "Vite config not found"
    fi
    
    # Check index.html
    if [ -f "taskflow-frontend/index.html" ]; then
        check 0 "index.html exists"
    else
        check 1 "index.html not found"
    fi
    
else
    check 1 "Frontend directory not found"
fi

echo ""
echo "📋 Checking Configuration Files..."
echo "----------------------------------"

# Check render.yaml
if [ -f "render.yaml" ]; then
    check 0 "render.yaml exists"
else
    warn "render.yaml not found (optional but recommended)"
fi

# Check .gitignore
if [ -f ".gitignore" ]; then
    check 0 ".gitignore exists"
    
    # Check if .env is ignored
    if grep -q "\.env" .gitignore; then
        check 0 ".env files are ignored"
    else
        warn ".env files not in .gitignore (security risk)"
    fi
    
    # Check if node_modules is ignored
    if grep -q "node_modules" .gitignore; then
        check 0 "node_modules is ignored"
    else
        check 1 "node_modules not ignored"
    fi
else
    check 1 ".gitignore not found"
fi

# Check README
if [ -f "README.md" ]; then
    check 0 "README.md exists"
else
    warn "README.md not found (recommended)"
fi

echo ""
echo "🔐 Checking Security..."
echo "----------------------"

# Check for .env files in repo
if git ls-files | grep -q "\.env$"; then
    check 1 ".env file is tracked in git (SECURITY RISK!)"
else
    check 0 "No .env files tracked in git"
fi

# Check for sensitive data
if git log --all --full-history --source --pretty=format: -- "*.env" | grep -q "password\|secret\|key"; then
    warn "Possible sensitive data in git history"
else
    check 0 "No obvious sensitive data in git history"
fi

echo ""
echo "📊 Summary"
echo "=========="
echo -e "${GREEN}Passed:${NC} $PASSED"
echo -e "${RED}Failed:${NC} $FAILED"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ Ready for deployment!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Follow the deployment guide: docs/RENDER_DEPLOYMENT_GUIDE.md"
    echo "3. Or use the quick checklist: DEPLOYMENT_CHECKLIST.md"
    exit 0
else
    echo -e "${RED}✗ Please fix the issues above before deploying${NC}"
    exit 1
fi
