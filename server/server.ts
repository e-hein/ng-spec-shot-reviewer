import { SsrServerConfig } from './server-config.model';
import { SpecShot, SpecShotFile, SsrServer } from '../api';
import { readdirSync, statSync, accessSync, writeFileSync, readFileSync, unlinkSync, copyFileSync,  } from 'fs';
import { join as joinPath, relative as relativePath, resolve as absolutePath, dirname, basename } from 'path';
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

    const approvements = this.readApprovedFile();
    this._specShots.forEach((specShot) => {
      specShot.approved = approvements.includes(specShot.id);
    })
  }

  private readApprovedFile() {
    try {
      return JSON.parse(readFileSync(this.cfg.approvedFilePath, 'UTF-8')) as string[];
    } catch (e) {
      console.warn(chalk.yellow('WARN: did not found any approvements, yet'));
      return [];
    }
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
        const id = encodeURIComponent(relativePath(baseDir, joinPath(this.cfg.directories.baseDir, fileDir, fileName)));
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

  public approve(id: string): Promise<void> {
    return this.vote(id, true);
  }

  public disapprove(id: string): Promise<void> {
    return this.vote(id, false);
  }

  private vote(id: string, approved: boolean): Promise<void> {
    const specShotToApprove = this._specShots.find((specShot) => specShot.id === id);
    if (!specShotToApprove) {
      throw new Error(`spec shot with id ${id} not found`);
    }
    specShotToApprove.approved = approved;

    writeFileSync(this.cfg.approvedFilePath, JSON.stringify(this._specShots.filter((specShot) => specShot.approved).map((specShot) => specShot.id)), 'utf-8');

    return Promise.resolve();
  }

  public applyApprovements(ids: string[]) {
    ids.forEach((id) => {
      const specShot = this._specShots.find((specShot) => specShot.id === id);
      if (!specShot) {
        throw new Error(`spec shot with id ${id} not found`);
      }
      const actualFile = specShot.actual;
      const baselineFile = specShot.actual;
      if (actualFile) {
        const actual = absolutePath(joinPath(this.cfg.directories.baseDir, actualFile.filename));
        const relative = relativePath(this.cfg.directories.actual, actual);
        const baseline = joinPath(this.cfg.directories.baseline, relative);
        copyFileSync(actual, relative);
        unlinkSync(actual);
      } else if (baselineFile) {
        const baseline = absolutePath(joinPath(this.cfg.directories.baseDir, baselineFile.filename));
        unlinkSync(baseline);
      }
      const diffFile = specShot.diff;
      if (diffFile) {
        const diff = absolutePath(joinPath(this.cfg.directories.baseDir, diffFile.filename));
        unlinkSync(diff);
      }
    });
    return Promise.resolve();
  }
}
