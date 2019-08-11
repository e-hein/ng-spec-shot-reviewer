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
  public approvedCount = 0;

  constructor(
    private backend: BackendService,
  ) { }

  ngOnInit() {
    this.backend.specShots().then((specShots) => {
      this.specShots = specShots.filter((specShot) => false
        || specShot.diff
        || !specShot.baseline
      );
      this.countApprovements();
    });
  }

  public selectSpecShot(specShot) {
    this.selectedSpecShot = specShot;
  }

  public vote(approved: boolean) {
    this.selectedSpecShot.approved = approved;
    this.specShots = this.specShots.slice();
    (approved
      ? this.backend.approve(this.selectedSpecShot.id)
      : this.backend.disapprove(this.selectedSpecShot.id)
    );
    this.countApprovements();
  }

  public applyApprovements() {
    this.backend.applyApprovements(this.approvedSpecShots.map(({id}) => id));
  }

  private get approvedSpecShots() {
    return this.specShots.filter(({approved}) => approved);
  }

  private countApprovements() {
    this.approvedCount = this.approvedSpecShots.length;
  }
}
