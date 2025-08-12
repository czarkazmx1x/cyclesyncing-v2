#!/bin/bash

# Clean previous builds
rm -rf .next out
rm -rf node_modules/.cache

# Install dependencies with production flag to reduce size
npm ci --production=false

# Build the application
npm run build

# Remove webpack cache before deployment
rm -rf .next/cache

# Prepare for Cloudflare Pages deployment
mkdir -p .cloudflare/static
cp -r out/* .cloudflare/static/

echo "Build completed and optimized for Cloudflare Pages!"