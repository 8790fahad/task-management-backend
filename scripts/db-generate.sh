#!/bin/bash
# Wrapper script to run drizzle-kit generate with Node.js
node --version > /dev/null 2>&1 || { echo "Node.js is required for drizzle-kit. Please install Node.js."; exit 1; }
npx --yes drizzle-kit generate "$@"

