#!/bin/sh
set -e

echo ">>> Syncing node_modules..."
npm install --prefer-offline --no-audit --no-fund 2>/dev/null || npm install

echo ">>> Starting application..."
exec "$@"
