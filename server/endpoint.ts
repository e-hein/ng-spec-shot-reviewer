import { RequestHandler, Router } from 'express';
import { SsrServerConfig } from './server-config.model';
import { SsrServer } from './server';

export class SsrEndpoint {
  private router = Router();
  private server: SsrServer;
  public get middleware(): RequestHandler {
    return this.router;
  }

  constructor(
    serverCfg: SsrServerConfig,
  ) {
    this.server = new SsrServer(serverCfg);
    this.router.get('/test', (_, res) => res.send('Ok'));
    this.router.get('/spec-shot', (_, res) => res.send(JSON.stringify(this.server.specShots())));
  }
}
