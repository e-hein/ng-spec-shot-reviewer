import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SpecShot } from 'api';
import { SubscriptionCollection } from 'utils';
import { ReviewService } from '../review/review.service';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './review-overview-page.component.html',
  styleUrls: ['./review-overview-page.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewOverviewPageComponent implements OnInit, OnDestroy {
  public specShots: SpecShot[];
  public approvedCount = 0;

  private subscriptions = new SubscriptionCollection();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private reviewService: ReviewService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  public ngOnInit() {
    this.subscriptions.push(
      this.reviewService.specShots.subscribe((specShots) => {
        this.specShots = specShots;
        this.changeDetectorRef.markForCheck();
      }),

      this.reviewService.approvedSpecShots.pipe(
        map((approvedSpecShots) => approvedSpecShots.length),
        distinctUntilChanged(),
      ).subscribe((approvedCount) => {
        this.approvedCount = approvedCount;
        this.changeDetectorRef.markForCheck();
      })
    );
  }

  public applyApprovements() {
    this.reviewService.applyApprovements();
  }

  public routeTo(specShot: SpecShot) {
    this.router.navigate([specShot.id], { relativeTo: this.route });
  }

  public ngOnDestroy() {
    this.subscriptions.onDestroy();
  }
}
