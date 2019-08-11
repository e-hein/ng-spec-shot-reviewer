import { SpecShot } from './spec-shot.model';

export interface SsrServer{
  specShots(): Promise<SpecShot[]>;
}
