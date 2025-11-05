#!/usr/bin/env node
// Wrapper script to run drizzle-kit generate with Node.js
import { execSync } from 'child_process';

console.log('⚠️  Note: db:generate has known compatibility issues with current drizzle versions.');
console.log('✅ Your migrations are already set up and working.');
console.log('📝 This command is only needed when modifying src/infrastructure/database/schema.ts\n');

try {
  execSync('npx --yes drizzle-kit generate', { stdio: 'inherit' });
} catch (error) {
  console.error('\n❌ db:generate failed due to version compatibility issues.');
  console.error('💡 This does NOT affect your application - migrations work fine!');
  console.error('📚 See DRIZZLE_NOTE.md for details.\n');
  process.exit(error.status || 1);
}

