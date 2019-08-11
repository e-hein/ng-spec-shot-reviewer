import { SsrServerConfig } from './server-config.model';
import { SpecShot, SpecShotFile } from './spec-shot.model';
import { readdirSync, statSync } from 'fs';
import { join as joinPath, relative as relativePath } from 'path';
import chalk from 'chalk';

export class SsrServer {
  private _specShots: SpecShot[] = [];

  constructor(
    private cfg: SsrServerConfig,
  ) {
    this.init();
  }

  private init(): void {
    this._specShots = [];
    this.scanForImages('actual');
    this.scanForImages('diff');
    this.scanForImages('baseline');
  }

  private scanForImages(type: 'actual' | 'diff' | 'baseline') {
    const baseDir = this.cfg.directories[type];
    this.findSpecShots(this.cfg.directories[type])
      .forEach((specShotFile) => {
        const id = relativePath(baseDir, specShotFile.filename);
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
          : this.foundSpecShot({ filename: entry, stats })
        ;
      })
      .reduce((ids, more) => ids.concat(...more), new Array<SpecShotFile>())
    ;
  }

  private foundSpecShot(specShotFile: SpecShotFile): SpecShotFile[] {
    console.log(chalk.cyan(`found image ${specShotFile.filename}`));
    return [specShotFile];
  }

  public specShots(): SpecShot[] {
    return this._specShots.slice();
  }
}
