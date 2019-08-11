import { Component, OnInit } from '@angular/core';
import { SpecShot } from 'api';
import { BackendService } from '../backend.service';

@Component({
  selector: 'ssr-review-page',
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.sass']
})
export class ReviewPageComponent implements OnInit {
  public specShots: SpecShot[];
  public selectedSpecShot: SpecShot;

  constructor(
    private backend: BackendService,
  ) { }

  ngOnInit() {
    this.backend.specShots().then((specShots) => {
      this.specShots = specShots;
    });
  }

  public selectSpecShot(specShot) {
    console.log('selected', specShot);
  }
}
