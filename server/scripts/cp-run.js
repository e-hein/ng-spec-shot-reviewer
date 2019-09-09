const { accessSync, copyFileSync, mkdirSync } = require('fs');
const { W_OK } = require('constants');
const { join, relative } = require('path');

const src = 'run.js';
const destPath = 'dist'
const destFile = join(destPath, 'run.js');

try {
  accessSync(destPath, W_OK);
} catch (_e) {
  mkdirSync(destPath);
  accessSync(destPath, W_OK);
}

copyFileSync(src, destFile);
