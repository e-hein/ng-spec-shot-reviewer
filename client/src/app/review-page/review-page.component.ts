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
    this.backend.specShots().then((specShots) => this.updateSpecShots(specShots));
  }

  private updateSpecShots(specShots: SpecShot[]) {
    this.specShots = specShots.filter((specShot) => false
      || specShot.diff
      || !specShot.baseline
    );
    if (this.selectedSpecShot && !this.specShots.some((specShot) => specShot.id === this.selectedSpecShot.id)) {
      delete this.selectedSpecShot;
    }
    this.countApprovements();
  }

  public selectSpecShot(specShot) {
    this.selectedSpecShot = specShot;
    console.log('selected spec shot', specShot);
  }

  public vote(approved: boolean) {
    this.selectedSpecShot.approved = approved;
    this.specShots = this.specShots.slice();
    (approved
      ? this.backend.approve(this.selectedSpecShot.id)
      : this.backend.disapprove(this.selectedSpecShot.id)
    );
    this.countApprovements();
    const index = this.specShots.indexOf(this.selectedSpecShot);
    if (index < this.specShots.length - 1) {
      this.selectedSpecShot = this.specShots[index + 1];
    }
  }

  public applyApprovements() {
    this.backend.applyApprovements(this.approvedSpecShots.map(({id}) => id))
      .then((updatedSpecShots) => this.updateSpecShots(updatedSpecShots));
  }

  private get approvedSpecShots() {
    return this.specShots.filter(({approved}) => approved);
  }

  private countApprovements() {
    this.approvedCount = this.approvedSpecShots.length;
  }
}
