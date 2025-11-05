#!/bin/bash

# Script to fix port 3000 conflict

PORT=3000

echo "🔍 Checking what's using port $PORT..."

# Find process using port 3000
PID=$(lsof -ti:$PORT 2>/dev/null)

if [ -z "$PID" ]; then
  echo "✅ Port $PORT is free!"
  echo "You can run: bun run dev"
  exit 0
fi

echo "⚠️  Found process using port $PORT: PID $PID"
echo ""
echo "Process details:"
ps -p $PID -o pid,comm,args 2>/dev/null || echo "Process $PID"
echo ""
read -p "Kill this process? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  kill -9 $PID 2>/dev/null
  if [ $? -eq 0 ]; then
    echo "✅ Process killed. Port $PORT is now free."
    echo "You can now run: bun run dev"
  else
    echo "❌ Failed to kill process. You may need sudo:"
    echo "   sudo kill -9 $PID"
  fi
else
  echo "Process not killed. Use a different port instead:"
  echo "   PORT=3001 bun run dev"
fi

