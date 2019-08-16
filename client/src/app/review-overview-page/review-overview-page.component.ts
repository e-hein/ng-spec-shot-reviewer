import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ssr-review-overview-page',
  templateUrl: './review-overview-page.component.html',
  styleUrls: ['./review-overview-page.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewOverviewPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
