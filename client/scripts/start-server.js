const { join, resolve, relative } = require('path');
const { spawn } = require('child_process');

const basePath = resolve('..');
const sampleProjectPath = resolve(join(basePath, 'sample-projects', 'toh-pt6'));
const serverPath = relative(sampleProjectPath, join(basePath, 'server'));
const tsNodePath = join(serverPath, 'node_modules', '.bin', 'ts-node');
const relServerPath = join('..', '..', '..', '..', 'server');
const tsConfigPath = join(relServerPath, 'tsconfig.json');
const appPath = join(serverPath, 'app.ts');

console.log({
  basePath,
  sampleProjectPath,
  serverPath,
  tsNodePath,
  tsConfigPath,
  appPath
});

const child = spawn(tsNodePath, [
  '-P ' + tsConfigPath,
  appPath,
], {
  cwd: sampleProjectPath,
  env: {
    PATH: process.env.PATH,
    PWD: process.env.PWD,
    DEBUG_MODE: 'true',
    TERM: 'xterm-256color',
  },
  stdio: 'inherit',
});

process.on('SIGTERM', () => child.kill());
