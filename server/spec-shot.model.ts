import { Stats } from 'fs';

export interface SpecShotFile {
  filename: string;
  stats: Stats;
}

export class SpecShot {
  public actual: SpecShotFile | false = false;
  public diff: SpecShotFile | false = false;
  public baseline: SpecShotFile | false = false;

  constructor(
    public readonly id: string
  ) {}
}
