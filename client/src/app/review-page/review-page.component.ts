import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ssr-review-page',
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.sass']
})
export class ReviewPageComponent {}
