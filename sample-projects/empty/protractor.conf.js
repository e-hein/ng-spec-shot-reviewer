const { join } = require('path');

/**
 * @type { import("protractor").Config }
 */
exports.config = {
  plugins: [
    {
        // The module name
        package: 'protractor-image-comparison',
        // Some options, see the docs for more
        options: {
            baselineFolder: join(process.cwd(), './e2e/spec-shots/baseline/'),
            formatImageName: `{tag}-{logName}-{width}x{height}`,
            screenshotPath: join(process.cwd(), './custom_name'),
            savePerInstance: true,
            // ... more options
        },
    },
  ],
};
