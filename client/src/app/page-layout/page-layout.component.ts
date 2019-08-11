import { Component, Input } from '@angular/core';

@Component({
  selector: 'ssr-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.sass']
})
export class PageLayoutComponent {
  @Input() public title: string;
}
