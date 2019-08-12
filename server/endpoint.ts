import { RequestHandler, Router, static as serveStatic, json } from 'express';
import { SsrServerConfig } from './server-config.model';
import { FsSsrServer } from './server';
import * as cors from 'cors';

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

export class SsrEndpoint {
  private router = Router();
  private server: FsSsrServer;
  public get middleware(): RequestHandler {
    return this.router;
  }

  constructor(
    serverCfg: SsrServerConfig,
  ) {
    this.server = new FsSsrServer(serverCfg);
    this.router.use('*', cors(corsOptions))
    this.router.get('/test', (_, res) => res.send('Ok'));
    this.router.put('/spec-shot/:id/approve', (req, res) => {
      this.server.approve(encodeURIComponent(req.params['id']))
        .then(() => res.sendStatus(200))
        .catch((e) => res.send(e).sendStatus(400))
    })
    this.router.put('/spec-shot/:id/disapprove', (req, res) => {
      this.server.disapprove(encodeURIComponent(req.params['id']))
        .then(() => res.sendStatus(200))
        .catch((e) => res.send(e).sendStatus(400))
    })
    this.router.get('/spec-shot', async (req, res) => {
      if (req.headers['cache-control'] === 'no-cache') {
        this.server.refresh();
      }
      res.send(JSON.stringify(await this.server.specShots()));
    });
    this.router.post('/applyApprovements', json(), (req, res) => {
      this.server.applyApprovements(req.body.ids)
        .then((updatedSpecShots) => res.send(updatedSpecShots))
        .catch((e) => res.send(e).sendStatus(400))
      ;
    })
    this.router.use('/image/actual', serveStatic(serverCfg.directories.actual));
    this.router.use('/image/diff', serveStatic(serverCfg.directories.diff));
    this.router.use('/image/baseline', serveStatic(serverCfg.directories.baseline));
  }
}
