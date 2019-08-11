import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SpecShot } from 'api';
import { of as observableOf } from 'rxjs';
import { PageLayoutComponent } from '../page-layout/page-layout.component';
import { SpecShotDetailsComponent } from '../spec-shot-details/spec-shot-details.component';
import { SpecShotListComponent } from '../spec-shot-list/spec-shot-list.component';
import { ReviewPageComponent } from './review-page.component';

fdescribe('ReviewPageComponent', () => {
  let component: ReviewPageComponent;
  let fixture: ComponentFixture<ReviewPageComponent>;
  let http: HttpClient;

  beforeEach(async(() => TestBed.configureTestingModule({
    declarations: [
      ReviewPageComponent,
      PageLayoutComponent,
      SpecShotListComponent,
      SpecShotDetailsComponent,
    ],
    providers: [
      { provide: HttpClient, useValue: { get: () => {} } },
    ]
  })
  .compileComponents()));

  beforeEach(async () => {
    fixture = TestBed.createComponent(ReviewPageComponent);
    component = fixture.componentInstance;
    http = fixture.debugElement.injector.get(HttpClient);
    spyOn(http, 'get').and.returnValue(observableOf([
      {
        id:'desktop_chrome/review-page-fhdtv-de-1920x1080',
        actual: {
          filename: 'actual/desktop_chrome/review-page-fhdtv-de-1920x1080.png',
          timestamp:1565541845139,
          size: 80150,
        },
        diff: {
          filename: 'diff/desktop_chrome/review-page-fhdtv-de-1920x1080.png',
          timestamp: 1565541845668,
          size: 24125,
        },
        baseline: {
          filename: 'baseline/desktop_chrome/review-page-fhdtv-de-1920x1080.png',
          timestamp: 1565527812480,
          size: 14719,
        },
        approved: false,
      },
      {
        id: 'desktop_chrome/review-page-fhdtv-en-1920x1080',
        actual: {
          filename: 'actual/desktop_chrome/review-page-fhdtv-en-1920x1080.png',
          timestamp: 1565541860803,
          size: 79526,
        },
        diff: false,
        baseline: false,
        approved: false,
      },
    ] as SpecShot[]))
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function findSpecShotLinkByIndex(num: number) {
    const detailLink = fixture.debugElement.query(By.css(`ssr-spec-shot-list li:nth-of-type(${num + 1}) a`));
    if (!detailLink) {
      throw new Error(`detail link number ${num} not found`);
    }
    return detailLink;
  }

  async function clickOnDetailLink(num: number) {
    const detailLink = findSpecShotLinkByIndex(num);
    detailLink.nativeElement.click();
    fixture.autoDetectChanges(true);
    await fixture.whenStable();
    fixture.autoDetectChanges(false);
  }

  function findSpecShotDetails() {
    const specShotDetails = fixture.debugElement.query(By.css('ssr-spec-shot-details'));
    if (!specShotDetails) {
      throw new Error('spec shot details not found');
    }
    return specShotDetails;
  }

  it(
    'should contain an detail link',
    () => expect(() => findSpecShotLinkByIndex(0)).not.toThrow(),
  );

  it(
    'when clicked on detail link should show details',
    async () => {
      await clickOnDetailLink(0);

      expect(() => findSpecShotDetails()).not.toThrow();
    }
  )
});
