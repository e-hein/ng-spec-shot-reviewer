import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SpecShot } from 'api';
import { take } from 'rxjs/operators';
import { ReviewService } from './review.service';

@Injectable({
  providedIn: 'root',
})
export class ReviewSpecShotResolver implements Resolve<SpecShot> {
  constructor(
    private reviewService: ReviewService,
  ) {}

  public resolve(route: ActivatedRouteSnapshot): Promise<SpecShot> {
    return this.reviewService.getSpecShot(route.params.specShotId).pipe(take(1)).toPromise();
  }
}
