#!/bin/sh
set -e

echo ">>> Syncing node_modules..."
npm install --include=dev --prefer-offline --no-audit --no-fund 2>/dev/null || npm install --include=dev

echo ">>> Starting application..."
exec "$@"
