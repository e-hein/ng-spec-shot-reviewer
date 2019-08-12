import * as express from 'express';
import * as fs from 'fs';
import chalk from 'chalk';
import { resolve, join, relative } from 'path';
import { SsrEndpoint } from './endpoint';
import { SsrAppConfig } from './app-config.model';
import { R_OK } from 'constants';
import { SsrImageDirectoriesConfig } from './server-config.model';

const app = express();
const cfg = new SsrAppConfig(process.cwd());

console.log(chalk.green('\nstarting spec shot reviewer ...'));

function findProtractorCfg(dir: string) {
  try {
    const testPath = join(dir, 'protractor.conf.js');
    fs.accessSync(testPath, R_OK);
    return testPath;
  } catch (e) {
    try {
      const testPath = join(dir, 'e2e', 'protractor.conf.js');
      fs.accessSync(testPath, R_OK);
      return testPath;
    } catch(e) {
      return false;
    }
  }
}
const protractorCfgPath = findProtractorCfg(process.cwd());
try {
  if (!protractorCfgPath) {
    throw new Error('protractor conf file not found');
  }
  const config = require(protractorCfgPath).config;
  const imgCfg = config.plugins.find((plugin) => plugin.package === 'protractor-image-comparison');

  if (imgCfg.options.screenshotPath) {
    cfg.endpoint.directories = new SsrImageDirectoriesConfig(imgCfg.options.screenshotPath);
  }
  if (imgCfg.options.baselineFolder) {
    cfg.endpoint.directories.baseline = imgCfg.options.baselineFolder;
  }
} catch (e) {
  console.warn('no protractor conf found');
}

const debugMode = false;
const ownFrontends = join(__dirname, debugMode ? 'dist' : '..', 'frontend');
console.log('\nown frontends in ', ownFrontends);
fs.readdirSync(ownFrontends).forEach((distFolder) => {
  const resourceFolder = '/' + distFolder;
  const targetFolder = resolve(ownFrontends, distFolder);
  console.log(chalk.yellow(resourceFolder), 'serve static', ':', targetFolder);
  app.use(resourceFolder, express.static(targetFolder), (req, res, next) => {
    res.sendFile(targetFolder + '/index.html');
  });
});

function findAngularApps(dir: string): string[] {
  if (!fs.statSync(dir).isDirectory()) {
    return [];
  }
  try {
    fs.accessSync(join(dir, 'index.html'));
    return [dir];
  } catch (e) {
    return fs.readdirSync(dir)
      .map((subdir) => findAngularApps(join(dir, subdir)))
      .reduce((allApps, moreApps) => allApps.concat(moreApps))
    ;
  }
}

if (cfg.angularAppsFolder) {
  console.log('\nother angular apps from', cfg.angularAppsFolder);
  const angularApps = findAngularApps(cfg.angularAppsFolder);
  if (angularApps.length > 0) {
    angularApps.forEach((distFolder) => {
      const indexFile = fs.readFileSync(join(distFolder, 'index.html'), 'utf-8');
      const baseHref = '/' + (indexFile.match(/<base.*href=['"]?\/?(2.6)\/?['"]?/) || [null, 'app'])[1];
      const alreadyUsed = cfg.reservedPathes.some((path) => baseHref.startsWith(path));
      if (alreadyUsed) {
        throw new Error(`invalid config: can't use '${baseHref}' as angular app context. '${alreadyUsed}' already used!`);
      }
      const targetFolder = resolve(cfg.angularAppsFolder, distFolder);
      console.log(chalk.yellow(baseHref), 'serve static', ':', targetFolder);
      app.use(baseHref, express.static(targetFolder), (_, res) => {
        res.sendFile(targetFolder + '/index.html');
      });
    });
  } else {
    console.error('no other angular apps found');
  }
}

console.log('\ncore services');
if (cfg.testPageUrl) {
  console.log(chalk.yellow(cfg.testPageUrl), 'server is alive test page', );
  app.get(cfg.testPageUrl, (_req, res) => res.send('Ok'));
}

console.log(chalk.yellow(cfg.backendUrl), 'ssr endpoint');
app.use(cfg.backendUrl, new SsrEndpoint(cfg.endpoint).middleware);

app.listen(cfg.port, () => console.log(chalk.green('\nspec shot reviewer listening on ' + cfg.port + '\n')));
