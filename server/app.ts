import chalk from 'chalk';
import * as express from 'express';
import * as fs from 'fs';
import { join, resolve } from 'path';
import { SsrAppConfig } from './app-config.model';
import { SsrEndpoint } from './endpoint';
import { SsrImageDirectoriesConfig } from './server-config.model';
import { canReadFsNode } from './utility.functions';

const app = express();
const cfg = new SsrAppConfig(process.cwd());

console.log(chalk.green('\nstarting spec shot reviewer ...'));

function findProtractorCfg(dir: string) {
  const cfgInProjectRooPath = join(dir, 'protractor.conf.js');
  if (canReadFsNode(cfgInProjectRooPath)) {
    return cfgInProjectRooPath;
  }

  const cfgInE2eDir = join(dir, 'e2e', 'protractor.conf.js');
  if (canReadFsNode(cfgInE2eDir)) {
    return cfgInE2eDir;
  }

  return false;
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
    cfg.endpoint.approvedFilePath = join(imgCfg.options.screenshotPath, 'approvements.json');
  }
  if (imgCfg.options.baselineFolder) {
    cfg.endpoint.directories.baseline = imgCfg.options.baselineFolder;
  }
} catch (e) {
  console.warn('no protractor conf found');
}

function deployAngularApp(distFolder: string) {
  const indexFile = fs.readFileSync(join(distFolder, 'index.html'), 'utf-8');
  const baseHref = '/' + (indexFile.match(/<base.*href=['"]?\/?([^'"]+)\/?['"]?/) || [null, 'app'])[1];
  const alreadyUsed = cfg.reservedPathes.some((path) => baseHref.startsWith(path));
  if (alreadyUsed) {
    throw new Error(`invalid config: can't use '${baseHref}' as angular app context. '${alreadyUsed}' already used!`);
  }
  const targetFolder = resolve(cfg.angularAppsFolder, distFolder);
  console.log(chalk.yellow(baseHref), 'serve static', ':', targetFolder);

  app.use(baseHref, express.static(targetFolder), (_, res) => {
    res.sendFile(targetFolder + '/index.html');
  });
}

function deployOwnFrontends() {
  const debugMode = process.env.DEBUG_MODE;
  const ownFrontends = join(__dirname, debugMode ? 'dist' : '..', 'frontend');
  console.log('\nown frontends in ', ownFrontends);
  const angularApps = findAngularApps(ownFrontends);
  if (angularApps.length > 0) {
    angularApps.forEach(deployAngularApp);
  } else {
    console.error('no other angular apps found');
  }
}
deployOwnFrontends();

function findAngularApps(dir: string): string[] {
  if (!fs.statSync(dir).isDirectory()) {
    return [];
  }
  if(canReadFsNode(join(dir, 'index.html'))) {
    return [dir];
  } else {
    return fs.readdirSync(dir)
      .map((subdir) => findAngularApps(join(dir, subdir)))
      .reduce((allApps, moreApps) => allApps.concat(moreApps), [])
    ;
  }
}

if (cfg.angularAppsFolder && canReadFsNode(cfg.angularAppsFolder)) {
  console.log('\nload local angular apps from', cfg.angularAppsFolder);
  const angularApps = findAngularApps(cfg.angularAppsFolder);
  if (angularApps.length > 0) {
    angularApps.forEach(deployAngularApp);
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

app.listen(cfg.port, cfg.hostname, () => console.log(chalk.green('\nspec shot reviewer listening on ' + cfg.port + '\n')));
