import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { SpecShot } from 'api';
import { take } from 'rxjs/operators';
import { ReviewService } from './review.service';

@Injectable({
  providedIn: 'root',
})
export class ReviewSpecShotsResolver implements Resolve<SpecShot[]> {
  constructor(
    private reviewService: ReviewService,
  ) {}

  public resolve(): Promise<SpecShot[]> {
    return this.reviewService.specShots.pipe(take(1)).toPromise();
  }
}
