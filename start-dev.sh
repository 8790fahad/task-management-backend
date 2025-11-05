#!/bin/bash

# Development server startup script with port conflict handling

# Kill any existing Bun processes from this project
echo "🧹 Cleaning up any existing processes..."
pkill -f "bun.*index.ts" 2>/dev/null
pkill -f "bun run dev" 2>/dev/null
sleep 1

# Try default port 3001, fallback to 3002
PORT=${PORT:-3001}

# Check if port is available
if lsof -ti:$PORT >/dev/null 2>&1; then
  echo "⚠️  Port $PORT is in use, trying 3002..."
  PORT=3002
  if lsof -ti:$PORT >/dev/null 2>&1; then
    echo "⚠️  Port 3002 is also in use, trying 3003..."
    PORT=3003
  fi
fi

echo "🚀 Starting server on port $PORT..."
echo ""

PORT=$PORT bun run dev

