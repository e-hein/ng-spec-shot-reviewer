import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ssr-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.sass']
})
export class PageLayoutComponent {
  @Input() public title: string;
}
