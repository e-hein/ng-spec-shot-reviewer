import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpecShot } from 'api';
import { switchMap } from 'rxjs/operators';
import { SubscriptionCollection } from 'utils';
import { ReviewService } from '../review/review.service';
import { ReviewNavigationService } from '../review/review-navigation.service';

@Component({
  selector: 'ssr-review-details-page',
  templateUrl: './review-details-page.component.html',
  styleUrls: ['./review-details-page.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewDetailsPageComponent implements OnInit, OnDestroy {
  public specShot: SpecShot;
  private subscriptions = new SubscriptionCollection();
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private reviewService: ReviewService,
    private navigate: ReviewNavigationService,
  ) {}

  public ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.params.pipe(
        switchMap(({specShotId}) => this.reviewService.getSpecShot(specShotId)),
      ).subscribe((specShot) => {
        this.specShot = specShot;
        this.changeDetectorRef.markForCheck();
      }),
    );
  }

  public async vote(approved: boolean) {
    await this.reviewService[approved ? 'approve' : 'disapprove'](this.specShot.id);
    this.navigate.toNextSpecShot(this.specShot.id);
  }

  public ngOnDestroy(): void {
    this.subscriptions.onDestroy();
  }
}
