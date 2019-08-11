import { Component, OnInit, TrackByFunction } from '@angular/core';
import { BackendService } from '../backend.service';
import { SpecShot } from 'api';

@Component({
  selector: 'ssr-review-page',
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.sass']
})
export class ReviewPageComponent implements OnInit {
  public specShots: SpecShot[];
  public selectedSpecShot: SpecShot;
  public trackById: TrackByFunction<{ id: string}> = (_, obj) => obj.id;

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
