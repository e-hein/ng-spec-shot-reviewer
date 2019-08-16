import { SpecShot } from 'api';
import { ReplaySubject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { BackendService } from './backend.service';

export class MockedBackendService extends BackendService {
  constructor(
    private specShots$r = new ReplaySubject<SpecShot[]>(1),
  ) {
    super();
  }

  public sendSpecShots(specShots: SpecShot[]) {
    this.specShots$r.next(specShots);
  }

  public approve(_id: string) {
    return Promise.resolve();
  }

  public disapprove(_id: string) {
    return Promise.resolve();
  }

  public specShots() {
    return this.specShots$r.asObservable().pipe(take(1)).toPromise();
  }

  public applyApprovements(_ids: string[]) {
    return this.specShots$r.asObservable().pipe(
      take(1),
      map((specShots) => specShots.filter((specShot) => !specShot.approved)),
      tap((specShots) => this.specShots$r.next(specShots)),
    ).toPromise();
  }
}
