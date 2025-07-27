// Simple database initialization script
const { execSync } = require('child_process');
const path = require('path');

console.log('🗄️ Initializing JobHunt AI database...');

try {
  // Change to the project directory
  process.chdir(path.join(__dirname, '..'));
  
  // Run the TypeScript file directly with ts-node
  console.log('📦 Installing ts-node if needed...');
  try {
    execSync('npm list ts-node', { stdio: 'ignore' });
  } catch {
    console.log('Installing ts-node...');
    execSync('npm install --save-dev ts-node', { stdio: 'inherit' });
  }
  
  // Run the database initialization
  console.log('🚀 Running database initialization...');
  execSync('npx ts-node src/lib/jobhunt/db-init.ts', { stdio: 'inherit' });
  
  console.log('✅ Database initialization completed successfully!');
  
} catch (error) {
  console.error('❌ Database initialization failed:', error.message);
  process.exit(1);
}