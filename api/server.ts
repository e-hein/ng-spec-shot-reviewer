import { SpecShot } from './spec-shot.model';

export interface SsrServer{
  specShots(): Promise<SpecShot[]>;
  approve(id: string): Promise<void>;
  disapprove(id: string): Promise<void>;
  applyApprovements(id: string[]): Promise<void>;
}
