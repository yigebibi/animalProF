#!/usr/bin/env node

/**
 * 文档检查脚本
 * 用于检查 API 接口是否有变更，提醒开发者更新文档
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 检查 API 文档更新...\n');

// 颜色输出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// 配置
const BACKEND_PATH = path.join(__dirname, '..');
const API_DOCS_PATH = path.join(__dirname, '../../API接口文档.md');
const DOCS_GUIDE_PATH = path.join(__dirname, '../../docs/接口文档维护指南.md');

// 检查 git 是否可用
function isGitAvailable() {
  try {
    execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// 获取最近修改的文件
function getChangedFiles() {
  try {
    const output = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf8' });
    return output.trim().split('\n').filter(Boolean);
  } catch {
    try {
      const output = execSync('git status --porcelain', { encoding: 'utf8' });
      return output
        .trim()
        .split('\n')
        .filter(Boolean)
        .map(line => line.trim().split(/\s+/)[1]);
    } catch {
      return [];
    }
  }
}

// 检查是否有后端代码变更
function hasBackendChanges(files) {
  return files.some(file =>
    file.includes('backend/src/modules/') ||
    file.includes('backend/src/common/') ||
    file.includes('backend/src/database/')
  );
}

// 检查是否有控制器变更
function getChangedControllers(files) {
  return files.filter(file =>
    file.includes('controller.ts')
  );
}

// 检查 API 文档是否已更新
function isApiDocsUpdated(files) {
  return files.some(file => file.includes('API接口文档.md'));
}

// 获取文档版本信息
function getDocVersion() {
  try {
    const content = fs.readFileSync(API_DOCS_PATH, 'utf8');
    const match = content.match(/^\*\*文档版本\*\*: (.+)$/m);
    return match ? match[1] : '未知';
  } catch {
    return '未知';
  }
}

// 主函数
function main() {
  console.log(`${colors.blue}📋 文档信息${colors.reset}`);
  console.log(`   文档路径: ${API_DOCS_PATH}`);
  console.log(`   文档版本: ${getDocVersion()}`);
  console.log('');

  if (!fs.existsSync(API_DOCS_PATH)) {
    console.log(`${colors.red}❌ API接口文档.md 不存在！${colors.reset}`);
    process.exit(1);
  }

  const files = getChangedFiles();

  if (files.length === 0) {
    console.log(`${colors.green}✅ 没有检测到变更${colors.reset}`);
    process.exit(0);
  }

  console.log(`${colors.blue}📝 最近变更的文件:${colors.reset}`);
  files.forEach(file => console.log(`   - ${file}`));
  console.log('');

  const backendChanges = hasBackendChanges(files);
  const changedControllers = getChangedControllers(files);
  const docsUpdated = isApiDocsUpdated(files);

  if (!backendChanges) {
    console.log(`${colors.green}✅ 没有后端接口变更${colors.reset}`);
    process.exit(0);
  }

  console.log(`${colors.yellow}⚠️  检测到后端代码变更${colors.reset}`);

  if (changedControllers.length > 0) {
    console.log(`   ${colors.yellow}变更的控制器:${colors.reset}`);
    changedControllers.forEach(file => console.log(`      - ${file}`));
    console.log('');
  }

  if (docsUpdated) {
    console.log(`${colors.green}✅ API接口文档.md 已同步更新${colors.reset}`);
    console.log('');
    console.log('💡 检查点:');
    console.log('   ☐ 接口说明已更新');
    console.log('   ☐ 请求/响应示例已更新');
    console.log('   ☐ 变更日志已添加');
    console.log('   ☐ 版本号已更新');
  } else {
    console.log(`${colors.red}❌ API接口文档.md 未更新！${colors.reset}`);
    console.log('');
    console.log('📖 请参考文档维护指南:');
    console.log(`   ${DOCS_GUIDE_PATH}`);
    console.log('');
    console.log('⏭️  快速打开文档:');
    console.log(`   npm run docs:open`);
    console.log('');
    process.exit(1);
  }
}

main();
