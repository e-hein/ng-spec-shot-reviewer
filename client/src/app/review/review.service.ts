import { Injectable } from '@angular/core';
import { SpecShot, SpecShotFile } from 'api';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount, take, distinctUntilChanged } from 'rxjs/operators';
import { ClientDataStateService } from '../client-data-state.service';
import { BackendService } from '../backend.service';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  public readonly specShots: Observable<SpecShot[]>;
  public readonly approvedSpecShots: Observable<SpecShot[]>;

  constructor(
    private backendService: BackendService,
    private clientState: ClientDataStateService,
  ) {
    const specShots = this.specShots = this.setupSpecShotsObservable();
    this.approvedSpecShots = this.setupApprovedSpecShots(specShots);
  }

  private setupSpecShotsObservable() {
    return this.clientState.specShots.asObservable().pipe(
      map((specShots) => specShots.filter((specShot) => false
        || specShot.diff
        || !specShot.baseline
      )),
      publishReplay(1),
      refCount(),
    );
  }

  private setupApprovedSpecShots(specShots: Observable<SpecShot[]>) {
    return specShots.pipe(
      map((specShots) => specShots.filter((specShot) => specShot.approved)),
      publishReplay(1),
      refCount(),
    );
  }

  public async approve(specShotId: string) {
    this.voteClientSide(specShotId, true);
    await this.backendService.approve(specShotId);
  }

  public async disapprove(specShotId: string) {
    this.voteClientSide(specShotId, false);
    await this.backendService.disapprove(specShotId);
  }

  private async voteClientSide(specShotId: string, vote: boolean) {
    const specShots = await this.specShots.pipe(take(1)).toPromise();
    const specShotIndex = specShots.findIndex((specShot) => specShot.id === specShotId);
    const specShot = specShots[specShotIndex];
    if (specShot.approved === vote) {
      return;
    }

    const updatedSpecShots = specShots.slice();
    updatedSpecShots[specShotIndex] = { ...specShot, approved: vote };
    this.clientState.specShots.update(updatedSpecShots);
  }

  public async applyApprovements() {
    const approvedSpecShots = await this.approvedSpecShots.pipe(take(1)).toPromise();
    const approvements = approvedSpecShots.map((specShot) => specShot.id);
    return this.backendService.applyApprovements(approvements)
      .then((updatedSpecShots) => this.clientState.specShots.update(updatedSpecShots))
    ;
  }

  public getSpecShot(id: string): Observable<SpecShot> {
    return this.specShots.pipe(
      map((specShots) => specShots.find((specShot) => specShot.id === id)),
      map((specShot) => ({
        specShot, hash: this.hashSpecShot(specShot),
      })),
      distinctUntilChanged((a, b) => (a && a.hash) === (b && b.hash)),
      map(({specShot}) => specShot),
    );
  }

  private hashSpecShot(specShot: SpecShot) {
    return [
      specShot.approved ? '1' : '0',
      this.hashSpecShotFile(specShot.actual),
      this.hashSpecShotFile(specShot.diff),
      this.hashSpecShotFile(specShot.baseline),
    ].join('-');
  }

  private hashSpecShotFile(specShotFile: SpecShotFile | false) {
    return '' + (specShotFile && specShotFile.timestamp);
  }
}
