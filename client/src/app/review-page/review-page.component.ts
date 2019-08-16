import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SpecShot } from 'api';
import { BackendService } from '../backend.service';
import { ClientDataStateService } from '../client-data-state.service';
import { SubscriptionCollection } from 'utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ssr-review-page',
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.sass']
})
export class ReviewPageComponent implements OnInit, OnDestroy {
  public specShots: SpecShot[];
  public selectedSpecShot: SpecShot;
  public approvedCount = 0;

  private subscriptions = new SubscriptionCollection();

  constructor(
    private backend: BackendService,
    private changeDetectorRef: ChangeDetectorRef,
    private clientState: ClientDataStateService,
  ) {}

  public ngOnInit() {
    this.subscriptions.push(
      this.clientState.specShots.asObservable().subscribe((specShots) => {
        this.updateSpecShots(specShots);
        this.changeDetectorRef.markForCheck();
      }),
    );
  }

  private updateSpecShots(specShots: SpecShot[]) {
    this.specShots = specShots.filter((specShot) => false
      || specShot.diff
      || !specShot.baseline
    );
    if (this.selectedSpecShot && !this.specShots.some((specShot) => specShot.id === this.selectedSpecShot.id)) {
      delete this.selectedSpecShot;
    }
    this.countApprovements();
  }

  public selectSpecShot(specShot) {
    this.selectedSpecShot = specShot;
    console.log('selected spec shot', specShot);
  }

  public vote(approved: boolean) {
    this.selectedSpecShot.approved = approved;
    this.specShots = this.specShots.slice();
    (approved
      ? this.backend.approve(this.selectedSpecShot.id)
      : this.backend.disapprove(this.selectedSpecShot.id)
    );
    this.countApprovements();
    const index = this.specShots.indexOf(this.selectedSpecShot);
    this.selectedSpecShot = this.specShots[index + 1];
  }

  public applyApprovements() {
    this.backend
      .applyApprovements(this.approvedSpecShots.map(({id}) => id))
      .then((updatedSpecShots) => this.clientState.specShots.update(updatedSpecShots))
    ;
  }

  private get approvedSpecShots() {
    return this.specShots.filter(({approved}) => approved);
  }

  private countApprovements() {
    this.approvedCount = this.approvedSpecShots.length;
  }

  public ngOnDestroy() {
    this.subscriptions.onDestroy();
  }
}
