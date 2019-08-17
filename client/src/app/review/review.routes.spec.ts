import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SpecShot } from 'api';
import { whenAllChangesDoneFor } from 'utils/testing/common.functions';
import { BackendService } from '../backend.service';
import { MockedBackendService } from '../mocked-backend.service';
import { ReviewDetailsPageComponent } from '../review-details-page/review-details-page.component';
import { ReviewOverviewPageComponent } from '../review-overview-page/review-overview-page.component';
import { ReviewPageComponent } from '../review-page/review-page.component';
import { reviewRoute } from './review.routes';
import { createSpecShotList } from 'utils/testing/spec-shot.test-data';

@Component({
  template: 'app &gt; <router-outlet></router-outlet>',
})
class DummyAppComponent {}

describe('review routes', () => {
  let mockedBackend: MockedBackendService;
  let fixture: ComponentFixture<DummyAppComponent>;
  let testData: SpecShot[];
  let router: Router;

  beforeEach(async () => {
    mockedBackend = new MockedBackendService();
    testData = createSpecShotList();

    TestBed.configureTestingModule({
      declarations: [
        DummyAppComponent,
        ReviewPageComponent,
        ReviewDetailsPageComponent,
        ReviewOverviewPageComponent,
      ],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: '',
            ...reviewRoute,
          }
        ]),
      ],
      providers: [
        { provide: BackendService, useValue: mockedBackend },
      ],
    });
    TestBed.overrideComponent(ReviewPageComponent, { set: {
      template: 'review page &gt; <router-outlet></router-outlet>',
    } });
    TestBed.overrideComponent(ReviewDetailsPageComponent, { set: { template: 'details {{specShot.id}}' }});
    TestBed.overrideComponent(ReviewOverviewPageComponent, { set: { template: 'overview' }});
    await TestBed.compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(DummyAppComponent);
    router = fixture.debugElement.injector.get(Router);
    router.navigate(['/']);
    await whenAllChangesDone();
  })

  it('should not show review page before spec shots are loaded', () => {
    expect(findReviewPage()).toBeFalsy();
  })

  it('when spec shots are loaded then should show overview', async () => {
    mockedBackend.sendSpecShots(testData);
    await whenAllChangesDone();
    expect(findReviewPage()).toBeTruthy();
    expect(findOverviewPage()).toBeTruthy();
  })

  it('check if spec shot exist before navigating there', async () => {
    mockedBackend.sendSpecShots(testData);
    await whenAllChangesDone();
    router.navigate(['id-does-not-exist']);
    await whenAllChangesDone();
    expect(findDetailsPage()).toBeFalsy();
  })

  it('when details page exists then should navigate there', async () => {
    // given
    mockedBackend.sendSpecShots(testData);
    await whenAllChangesDone();
    const specShotIdToShow = testData[0].id;

    //when
    router.navigate([specShotIdToShow]);
    await whenAllChangesDone();
    await whenAllChangesDone();

    //then
    const detailsPage = findDetailsPage();
    expect(detailsPage).toBeTruthy();
    expect(detailsPage.componentInstance.specShot.id).toBe(specShotIdToShow);
  })

  function findReviewPage() {
    return fixture.debugElement.query(By.directive(ReviewPageComponent));
  }

  function findOverviewPage() {
    return fixture.debugElement.query(By.directive(ReviewOverviewPageComponent));
  }

  function findDetailsPage() {
    return fixture.debugElement.query(By.directive(ReviewDetailsPageComponent));
  }

  async function whenAllChangesDone() {
    await whenAllChangesDoneFor(fixture);
  }
});
