#!/bin/bash
# Script to publish the Convertorio Node.js SDK to npm

set -e

echo "🚀 Publishing Convertorio Node.js SDK to npm"
echo "============================================"
echo ""

# Navigate to the package directory
cd "$(dirname "$0")/libs/nodejs"

# Check if logged in
echo "Checking npm login status..."
if ! npm whoami &> /dev/null; then
    echo "❌ You are not logged in to npm"
    echo "Please run: npm login"
    exit 1
fi

echo "✓ Logged in as: $(npm whoami)"
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install

# Run tests
echo "Running tests..."
npm test

# Verify package
echo "Verifying package..."
npm pack --dry-run

# Ask for confirmation
echo ""
echo "Ready to publish @convertorio/sdk"
read -p "Continue with publication? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Publication cancelled"
    exit 0
fi

# Publish
echo "Publishing to npm..."
npm publish --access public

echo ""
echo "✅ Package published successfully!"
echo ""
echo "Verify at: https://www.npmjs.com/package/@convertorio/sdk"
echo "Install with: npm install @convertorio/sdk"
