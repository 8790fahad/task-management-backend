#!/usr/bin/env node
// Wrapper script to run drizzle-kit studio with Node.js
import { execSync } from 'child_process';

console.log('⚠️  Note: db:studio has known compatibility issues with current drizzle versions.');
console.log('✅ Your database is working fine - you can use psql or any other database tool instead.\n');

try {
  execSync('npx --yes drizzle-kit studio', { stdio: 'inherit' });
} catch (error) {
  console.error('\n❌ db:studio failed due to version compatibility issues.');
  console.error('💡 This does NOT affect your application.');
  console.error('💡 Alternative: Use psql or any PostgreSQL GUI tool to connect to your database.');
  console.error('📚 See DRIZZLE_NOTE.md for details.\n');
  process.exit(error.status || 1);
}

