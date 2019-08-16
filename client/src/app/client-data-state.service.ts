import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { LoadableClientDataState } from 'utils';

@Injectable({
  providedIn: 'root',
})
export class ClientDataStateService {
  public readonly specShots = new LoadableClientDataState(() => this.backendService.specShots());

  constructor(
    private backendService: BackendService,
  ) {}
}
