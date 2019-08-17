import { Injectable } from '@angular/core';
import { SsrServer, SpecShot } from 'api';

@Injectable()
export abstract class BackendService implements SsrServer {
  public abstract specShots(): Promise<SpecShot[]>;
  public abstract approve(id: string): Promise<void>;
  public abstract disapprove(id: string): Promise<void>;
  public abstract applyApprovements(ids: string[]): Promise<SpecShot[]>;
}
