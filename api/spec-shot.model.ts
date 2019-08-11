export interface SpecShotFile {
  filename: string;
  timestamp: number;
  size: number;
}

export class SpecShot {
  public actual: SpecShotFile | false = false;
  public diff: SpecShotFile | false = false;
  public baseline: SpecShotFile | false = false;
  public approved = false;

  constructor(
    public readonly id: string,
    public title: string = decodeURIComponent(id).replace(/[-_/]/g, ' '),
  ) {}
}
