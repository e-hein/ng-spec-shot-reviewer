import { Router } from '@angular/router';
import { ReviewService } from './review.service';
import { take } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReviewNavigationService {
  constructor(
    private reviewService: ReviewService,
    private router: Router
  ) {}

  public async toNextSpecShot(lastSpecShotId: string) {
    const specShots = await this.reviewService.specShots.pipe(take(1)).toPromise();
    const nextIndex = specShots.findIndex((specShot) => specShot.id === lastSpecShotId) + 1;
    if (nextIndex < specShots.length) {
      const nextSpecShotId = specShots[nextIndex].id;
      return this.router.navigate(['review', nextSpecShotId]);
    } else {
      return this.router.navigate(['review']);
    }
  }
}
