#!/usr/bin/env node

/**
 * 快速打开 API 文档
 */

const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

const API_DOCS_PATH = path.join(__dirname, '../../API接口文档.md');

console.log('📖 打开 API 接口文档...');
console.log(`   路径: ${API_DOCS_PATH}`);

try {
  if (os.platform() === 'win32') {
    execSync(`start "" "${API_DOCS_PATH}"`);
  } else if (os.platform() === 'darwin') {
    execSync(`open "${API_DOCS_PATH}"`);
  } else {
    execSync(`xdg-open "${API_DOCS_PATH}"`);
  }
  console.log('✅ 文档已打开');
} catch (e) {
  console.log('⚠️  无法自动打开文档，请手动打开:');
  console.log(`   ${API_DOCS_PATH}`);
}
