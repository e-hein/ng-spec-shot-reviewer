import { ReviewService } from './review.service';
import { Injectable } from '@angular/core';
import { BackendService } from '../backend.service';
import { ClientDataStateService } from '../client-data-state.service';
import { SpecShot } from 'api';
import { ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MockedBackendService } from '../mocked-backend.service';

@Injectable()
export class MockedReviewService extends ReviewService {
  constructor(
    private specShots$r = new ReplaySubject<SpecShot[]>(1),
    mockedBackendService = new MockedBackendService(specShots$r),
  ) {
    super(mockedBackendService, new ClientDataStateService(mockedBackendService))
  }

  public sendSpecShots(specShots: SpecShot[]) {
    this.specShots$r.next(specShots);
  }
}
