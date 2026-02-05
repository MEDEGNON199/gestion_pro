#!/bin/bash

echo "🔨 Building TaskFlow API for Production..."
echo "============================================"

# Exit on error
set -e

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the application
echo "🏗️  Building NestJS application..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output in: dist/"
    ls -lh dist/
else
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "============================================"
echo "🎉 Ready for deployment!"
