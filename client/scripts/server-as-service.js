const { spawn } = require('child_process');
const { accessSync, openSync, readFileSync, statSync, unlinkSync, writeFileSync } = require('fs');
const chalk = require('chalk');
const { SIGTERM } = require('constants');
const { cfg } = require('./service-cfg');

console.log({cfg});

const initialErrors = readErrorSize();
const out = openSync(cfg.logPath.stdout, 'a');
const err = openSync(cfg.logPath.error, 'a');

const answerFromParams = readAnswerFromParams();

if (answerFromParams) {
  processAnswer(answerFromParams).then(() => process.exit(0));
} else if (pidFileIsPresent()) {
  console.warn('server exists?');
  askForAction().then(process(answer)).then(() => process.exit(0));
} else {
  startServer().then(() => process.exit(0));
}

function readErrorSize() {
  try {
    return statSync(cfg.logPath.error).size;
  } catch(e) {
    return 0;
  }
}

function pidFileIsPresent() {
  try {
    accessSync(cfg.pidFilePath, 'utf-8');
    return true;
  } catch (e) {
    return false;
  }
}

function readAnswerFromParams() {
  const args = process.argv;
  const argIndex = args && args.findIndex((arg) => arg.endsWith(__filename));
  return argIndex && args[argIndex + 1];
}

function askForAction() {
  const readline = require('readline');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const u = (txt) => chalk.underline(txt);

  return new Promise((resolve) => rl.question(`How to continue? [${u('e')}xit|${u('s')}top|${u('r')}estart]: `, (answer) => {
    console.log();
    rl.close();
    processAnswer(answer).then(resolve);
  }));
}

async function processAnswer(answer) {
  console.log('do', answer);
  switch(answer) {
    case 'e':
    case 'exit':
      break;
    case 'stopIfPresent':
      await ensureServerIsDown();
      break;
    case 's':
    case 'stop':
      await stopServer();
      break;
    case 'r':
    case 'restart':
      try {
        await stopServer();
      } catch (e) {
        console.log('no server running ... start server');
      }
      console.log();
      await startServer();
      break;
    default:
      console.error('unknown command');
      process.exit(1);
  }
}

async function ensureServerIsDown() {
  if (pidFileIsPresent()) {
    await stopServer();
  } else {
    console.log('no server is running')
  }
}

function stopServer() {
  const pid = parseInt(readFileSync(cfg.pidFilePath, 'utf-8'));
  unlinkSync(cfg.pidFilePath);
  console.log('stop server with pid ' + pid);
  process.kill(pid, SIGTERM);
  return new Promise(resolve => setTimeout(resolve, 1000));
}

function startServer() {
  console.log('start server');
  var backendProcess = spawn('node', [require.resolve('./start-server')], {
    detached: true,
    stdio: ['ignore', out, err],
  });
  console.log('spawned server process with pid ' + backendProcess.pid);
  return new Promise((resolve) => setTimeout(() => {
    if (backendProcess.killed) {
      console.error(readFileSync(cfg.logPath.error));
      process.exit(1);
    }
    const newErrors = readErrorSize();
    if (newErrors > initialErrors) {
      console.error(readFileSync(cfg.logPath.error, 'utf-8').substr(initialErrors));
      process.exit(1);
    }
    writeFileSync(cfg.pidFilePath, backendProcess.pid);
    console.log('server started');
    backendProcess.unref();
    backendProcess = undefined;
    resolve();
  }, 1000));
}
