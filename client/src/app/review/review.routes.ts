import { Route } from '@angular/router';
import { ReviewDetailsPageComponent } from '../review-details-page/review-details-page.component';
import { ReviewOverviewPageComponent } from '../review-overview-page/review-overview-page.component';
import { ReviewPageComponent } from '../review-page/review-page.component';
import { ReviewSpecShotResolver } from './review-spec-shot.resolver';
import { ReviewSpecShotsResolver } from './review-spec-shots.resolver';

export const reviewRoute = {
  component: ReviewPageComponent,
  resolve: {
    specShots: ReviewSpecShotsResolver,
  },
  children: [
    { path: '', component: ReviewOverviewPageComponent },
    {
      path: ':specShotId',
      component: ReviewDetailsPageComponent,
      resolve: {
        specShot: ReviewSpecShotResolver,
      }
    }
  ],
} as Route;
