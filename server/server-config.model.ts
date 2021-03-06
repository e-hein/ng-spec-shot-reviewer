import { join } from 'path';

export class SsrImageDirectoriesConfig {
  constructor(
    public baseDir: string,
    public actual = join(baseDir, 'actual'),
    public diff = join(baseDir, 'diff'),
    public baseline = join(baseDir, 'baseline'),
  ) {}
}

export class SsrServerConfig {
  constructor(
    baseDir: string,
    public directories = new SsrImageDirectoriesConfig(baseDir),
    public approvedFilePath = join(baseDir, 'approved.json'),
  ) {}
}
