import { Component, EventEmitter, Input, Output, TrackByFunction } from '@angular/core';
import { SpecShot } from 'api';

@Component({
  selector: 'ssr-spec-shot-list',
  templateUrl: './spec-shot-list.component.html',
  styleUrls: ['./spec-shot-list.component.sass']
})
export class SpecShotListComponent {
  @Input() public specShots: SpecShot[];
  @Input() public selected: SpecShot;
  @Output() public select = new EventEmitter<SpecShot>();
  public trackById: TrackByFunction<{ id: string}> = (_, obj) => obj.id;

  public onSelect(specShot: SpecShot) {
    this.selected = specShot;
    this.select.emit(specShot);
  }
}
