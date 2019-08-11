import { SsrServerConfig } from './server-config.model';
import { join as joinPath } from 'path';

export class SsrAppConfig {

  constructor(
    baseDir: string,
    public port = 8090,
    public testPageUrl = '/express-test',
    public backendUrl = '/ssr-server',
    public reservedPathes = [testPageUrl, backendUrl],
    public angularAppsFolder = joinPath(baseDir, 'dist'),
    public endpoint = new SsrServerConfig(joinPath(baseDir, 'e2e', 'spec-shots')),
  ) {}
}
