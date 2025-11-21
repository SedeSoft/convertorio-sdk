#!/bin/bash

# Script to publish convertorio-sdk to RubyGems
# Run this script after doing 'gem signin'

set -e

echo "🚀 Publishing convertorio-sdk to RubyGems..."
echo ""

# Check if gem file exists
if [ ! -f "convertorio-sdk-1.2.0.gem" ]; then
    echo "❌ Gem file not found. Building..."
    gem build convertorio-sdk.gemspec
fi

echo "📦 Gem file: convertorio-sdk-1.2.0.gem"
echo "📏 Size: $(du -h convertorio-sdk-1.2.0.gem | cut -f1)"
echo ""

# Check credentials
if [ ! -f ~/.gem/credentials ]; then
    echo "❌ No credentials found. Please run: gem signin"
    exit 1
fi

echo "✅ Credentials found"
echo ""

# Show current user
echo "📧 Checking authentication..."
CURRENT_USER=$(gem owner convertorio-sdk-1.2.0.gem 2>&1 | grep -o '[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]*\.[a-zA-Z]*' | head -1 || echo "unknown")
echo "   Authenticated as: $CURRENT_USER"
echo ""

# Ask for confirmation
read -p "🔔 Ready to push to RubyGems? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 1
fi

# Push to RubyGems
echo ""
echo "📤 Pushing to RubyGems.org..."
gem push convertorio-sdk-1.2.0.gem

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully published!"
    echo "🌐 View at: https://rubygems.org/gems/convertorio-sdk"
    echo ""
    echo "📥 Users can now install with:"
    echo "   gem install convertorio-sdk"
    echo ""
else
    echo ""
    echo "❌ Publication failed"
    echo ""
    echo "Possible issues:"
    echo "1. API key doesn't have push permissions"
    echo "2. You're not the owner (first time pushing this gem)"
    echo "3. Network issues"
    echo ""
    echo "Solutions:"
    echo "1. Re-authenticate: gem signin"
    echo "2. Check your RubyGems account settings"
    echo "3. Try again in a few minutes"
    exit 1
fi
