// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
const { join } = require('path');

/**
 * @type { import("protractor").Config }
 */
exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome',
    'logName': 'en'
  },
  directConnect: true,
  baseUrl: 'http://localhost:8090/spec-shot-reviewer/en',
  framework: 'jasmine',
  plugins: [
    {
        // The module name
        package: 'protractor-image-comparison',
        // Some options, see the docs for more
        options: {
            baselineFolder: join(process.cwd(), './e2e/spec-shots/baseline/'),
            formatImageName: `{tag}-{logName}-{width}x{height}`,
            screenshotPath: join(process.cwd(), './e2e/spec-shots/'),
            savePerInstance: true,
            // ... more options
        },
    },
  ],
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};
