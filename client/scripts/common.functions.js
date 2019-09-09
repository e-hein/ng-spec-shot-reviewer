module.exports = {
  isWindows: () => /^win/.test(require('os').platform()),
}
