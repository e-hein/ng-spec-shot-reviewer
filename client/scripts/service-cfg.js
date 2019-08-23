const { join } = require('path');

module.exports = {
  cfg: {
    pidFilePath: join(__dirname, 'server.pid'),
    logPath: {
      stdout: join(__dirname, 'server-stdout.log'),
      error: join(__dirname, 'server-error.log'),
    },
  }
};
