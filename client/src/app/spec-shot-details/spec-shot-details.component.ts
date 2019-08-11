import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SpecShot } from 'api';

@Component({
  selector: 'ssr-spec-shot-details',
  templateUrl: './spec-shot-details.component.html',
  styleUrls: ['./spec-shot-details.component.sass']
})
export class SpecShotDetailsComponent {
  @Input() specShot: SpecShot;
  @Output() vote = new EventEmitter<boolean>();
}
