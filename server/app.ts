import * as express from 'express';
import * as fs from 'fs';
import chalk from 'chalk';
import { resolve, join } from 'path';
import { SsrEndpoint } from './endpoint';
import { SsrAppConfig } from './app-config.model';

const app = express();
const cfg = new SsrAppConfig(process.cwd());

console.log(chalk.green('\nstarting spec shot reviewer ...'));

const ownFrontends = join(__dirname, '..', 'frontend');
console.log('\nown frontends in ', ownFrontends);
fs.readdirSync(ownFrontends).forEach((distFolder) => {
  const resourceFolder = '/' + distFolder;
  const targetFolder = resolve(ownFrontends, distFolder);
  console.log(chalk.yellow(resourceFolder), 'serve static', ':', targetFolder);
  app.use(resourceFolder, express.static(targetFolder), (req, res, next) => {
    res.sendFile(targetFolder + '/index.html');
  });
});

if (cfg.angularAppsFolder) {
  console.log('\nother angular apps from', cfg.angularAppsFolder);
  fs.readdirSync(cfg.angularAppsFolder).forEach((distFolder) => {
    const resourceFolder = '/' + distFolder;
    const alreadyUsed = cfg.reservedPathes.some((path) => path.startsWith(resourceFolder));
    if (alreadyUsed) {
      throw new Error(`invalid config: can't use '${resourceFolder}' as angular app context. '${alreadyUsed}' already used!`);
    }
    const targetFolder = resolve(cfg.angularAppsFolder, distFolder);
    console.log(chalk.yellow(resourceFolder), 'serve static', ':', targetFolder);
    app.use(resourceFolder, express.static(targetFolder), (req, res, next) => {
      res.sendFile(targetFolder + '/index.html');
    });
  });
}

console.log('\ncore services');
if (cfg.testPageUrl) {
  console.log(chalk.yellow(cfg.testPageUrl), 'server is alive test page', );
  app.get(cfg.testPageUrl, (_req, res) => res.send('Ok'));
}

console.log(chalk.yellow(cfg.backendUrl), 'ssr endpoint');
app.use(cfg.backendUrl, new SsrEndpoint(cfg.endpoint).middleware);

app.listen(cfg.port, () => console.log(chalk.green('\nspec shot reviewer listening on ' + cfg.port + '\n')));
