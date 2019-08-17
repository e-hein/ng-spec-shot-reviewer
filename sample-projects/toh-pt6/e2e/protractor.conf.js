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
    chromeOptions: {
      args: [ "--headless", "--disable-gpu" ],
      mobileEmulation: {
        "deviceMetrics": {
            "width": 500,
            "height": 1024,
            "pixelRatio": 1.0
        }
      }
    },
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  plugins: [
      {
          // The module name
          package: 'protractor-image-comparison',
          // Some options, see the docs for more
          options: {
              baselineFolder: join(process.cwd(), './baseline/'),
              formatImageName: `{tag}-{width}x{height}`,
              screenshotPath: join(process.cwd(), '.tmp/'),
              savePerInstance: true,
              // ... more options
          },
      },
  ],
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};
