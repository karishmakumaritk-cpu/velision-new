#!/usr/bin/env bash
# Helper: install dependencies for root, server and client from repo root
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "Working directory: $ROOT_DIR"

# Install root deps if package.json exists
if [ -f "$ROOT_DIR/package.json" ]; then
  echo "Installing root dependencies..."
  (cd "$ROOT_DIR" && npm install)
else
  echo "No root package.json found, skipping root install."
fi

# Install server deps
if [ -d "$ROOT_DIR/server" ] && [ -f "$ROOT_DIR/server/package.json" ]; then
  echo "Installing server dependencies..."
  (cd "$ROOT_DIR/server" && npm install)
else
  echo "No server/package.json found, skipping server install."
fi

# Install client deps
if [ -d "$ROOT_DIR/client" ] && [ -f "$ROOT_DIR/client/package.json" ]; then
  echo "Installing client dependencies..."
  (cd "$ROOT_DIR/client" && npm install)
else
  echo "No client/package.json found, skipping client install."
fi

echo "Install complete."
echo ""
echo "Start server:  cd $ROOT_DIR/server && npm run dev  (or npm start)"
echo "Start client:  cd $ROOT_DIR/client && npm start"
