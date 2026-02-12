const fs = require('fs');
const path = require('path');

// Paths
const frontendDist = path.join(__dirname, 'frontend', 'dist');
const backendPublic = path.join(__dirname, 'backend', 'public');

console.log('📦 Copying frontend build to backend/public...');

// Remove old public folder if exists
if (fs.existsSync(backendPublic)) {
  fs.rmSync(backendPublic, { recursive: true, force: true });
  console.log('🗑️  Removed old public folder');
}

// Copy dist to public
if (fs.existsSync(frontendDist)) {
  fs.cpSync(frontendDist, backendPublic, { recursive: true });
  console.log('✅ Frontend build copied successfully!');
  console.log(`📁 Location: ${backendPublic}`);
} else {
  console.error('❌ Frontend dist folder not found! Run "npm run frontend:build" first.');
  process.exit(1);
}
