import { Injectable } from '@angular/core';
import { LoadableClientDataState } from 'utils';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root',
})
export class ClientDataStateService {
  public readonly specShots = new LoadableClientDataState(() => this.backendService.specShots());

  constructor(
    private backendService: BackendService,
  ) {}
}
