import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SpecShot } from 'api';
import { whenAllChangesDoneFor } from 'utils/testing/common.functions';
import { createSpecShotList } from 'utils/testing/spec-shot.test-data';
import { appModulesBundles } from '../app-module-bundles';
import { SpecShotListComponent } from './spec-shot-list.component';

export const specShotListCss = {
  link: (num: number) => `ssr-spec-shot-list li:nth-of-type(${num + 1}) a`,
}

export class SpecShotListRemote {
  constructor(
    private debugElement: DebugElement,
  ) {}

  public findSpecShotLinkByIndex(num: number) {
    const detailLink = this.debugElement.query(By.css(specShotListCss.link(num)));
    if (!detailLink) {
      throw new Error(`detail link number ${num} not found`);
    }
    return detailLink;
  }

  public async clickOnDetailLink(num: number) {
    const detailLink = this.findSpecShotLinkByIndex(num);
    detailLink.nativeElement.click();
  }
}

@Component({
  template: '<ssr-spec-shot-list [specShots]="specShots"></ssr-spec-shot-list>',
})
class TestParentComponent {
  public specShots: SpecShot[];
}

describe('SpecShotListComponent', () => {
  let component: SpecShotListComponent;
  let fixture: ComponentFixture<TestParentComponent>;
  let testData: SpecShot[];
  let remote: SpecShotListRemote;

  beforeEach(async(() => {
    testData = createSpecShotList();
    TestBed.configureTestingModule({
      imports: [
        ...appModulesBundles.material,
      ],
      declarations: [
        SpecShotListComponent,
        TestParentComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestParentComponent);
    remote = new SpecShotListRemote(fixture.debugElement);
    fixture.componentInstance.specShots = testData;
    await whenAllChangesDoneFor(fixture);
    component = fixture.debugElement.query(By.directive(SpecShotListComponent)).componentInstance;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it(
    'should contain an detail link',
    () => expect(() => remote.findSpecShotLinkByIndex(0)).not.toThrow(),
  );

  it(
    'when clicked on detail link should show details',
    async () => {
      const selectionSpy = spyOn(component.select, 'emit');

      remote.clickOnDetailLink(0);

      expect(selectionSpy).toHaveBeenCalledWith(testData[0]);
    }
  )
});
