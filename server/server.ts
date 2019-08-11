import { SsrServerConfig } from './server-config.model';
import { SpecShot, SpecShotFile, SsrServer } from '../api';
import { readdirSync, statSync, accessSync } from 'fs';
import { join as joinPath, relative as relativePath, dirname, basename } from 'path';
import chalk from 'chalk';
import { R_OK } from 'constants';

export class FsSsrServer implements SsrServer {
  private _specShots: SpecShot[] = [];

  constructor(
    private cfg: SsrServerConfig,
  ) {
    this.refresh();
  }

  public refresh(): void {
    this._specShots = [];
    this.scanForImages('actual');
    this.scanForImages('diff');
    this.scanForImages('baseline');
  }

  private scanForImages(type: 'actual' | 'diff' | 'baseline') {
    const baseDir = this.cfg.directories[type];

    try {
      accessSync(baseDir, R_OK);
    } catch(e) {
      console.warn(chalk.yellow(`WARN: no '${type}'-images found!`));
      return;
    }

    console.log('scan for images', baseDir);
    this.findSpecShots(baseDir)
      .forEach((specShotFile) => {
        const fileDir = dirname(specShotFile.filename);
        const fileName = basename(specShotFile.filename, '.png');
        const id = relativePath(baseDir, joinPath(this.cfg.directories.baseDir, fileDir, fileName));
        const specShot = this.getOrCreateSpecShot(id);
        specShot[type] = specShotFile;
      });
  }

  private getOrCreateSpecShot(id: string) {
    const existingSpecShot = this._specShots.find((specShot) => specShot.id === id);
    if (existingSpecShot) {
      return existingSpecShot;
    }

    const newSpecShot = new SpecShot(id);
    this._specShots.push(newSpecShot);
    return newSpecShot;
  }

  private findSpecShots(dir: string): SpecShotFile[] {
    console.log(chalk.gray(`scan dir ${dir}`));
    return readdirSync(dir)
      .map((entry) => joinPath(dir, entry))
      .map((entry) => {
        const stats = statSync(entry);
        return stats.isDirectory()
          ? this.findSpecShots(entry)
          : this.foundSpecShot({
            filename: relativePath(this.cfg.directories.baseDir, entry),
            timestamp: stats.mtime.getTime(),
            size: stats.size,
           })
        ;
      })
      .reduce((ids, more) => ids.concat(...more), new Array<SpecShotFile>())
    ;
  }

  private foundSpecShot(specShotFile: SpecShotFile): SpecShotFile[] {
    console.log(chalk.cyan(`found image ${specShotFile.filename}`));
    return [specShotFile];
  }

  public specShots(): Promise<SpecShot[]> {
    return Promise.resolve(this._specShots.slice());
  }
}
