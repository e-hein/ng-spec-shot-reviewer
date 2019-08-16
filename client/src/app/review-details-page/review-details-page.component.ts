import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ssr-review-details-page',
  templateUrl: './review-details-page.component.html',
  styleUrls: ['./review-details-page.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewDetailsPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
