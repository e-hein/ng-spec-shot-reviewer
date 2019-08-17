import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SpecShot } from 'api';
import { BehaviorSubject } from 'rxjs';
import { whenAllChangesDoneFor } from 'utils/testing/common.functions';
import { createSpecShot } from 'utils/testing/spec-shot.test-data';
import { MockedBackendService } from '../mocked-backend.service';
import { SpecShotDetailsComponent } from '../spec-shot-details/spec-shot-details.component';
import { ReviewDetailsPageComponent } from './review-details-page.component';
import { BackendService } from '../backend.service';

const specShotId = 'spec-shot-id';
const anotherSpecShotId = 'another-id';

@Component({
  selector: 'ssr-spec-shot-details',
  template: `dummy spec shot details for "{{specShot.title}}" approved: {{'' + specShot.approved}}`,
})
class DummySpecShotDetailsComponent extends SpecShotDetailsComponent {}

describe('ReviewDetailsPageComponent', () => {
  let mockedBackendService: MockedBackendService;
  let routeParams$b: BehaviorSubject<{ specShotId: string }>;
  let component: ReviewDetailsPageComponent;
  let testData: SpecShot[];
  let fixture: ComponentFixture<ReviewDetailsPageComponent>;

  beforeEach(async(() => {
    mockedBackendService = new MockedBackendService();
    routeParams$b = new BehaviorSubject({ specShotId });
    testData = [createSpecShot(specShotId), createSpecShot(anotherSpecShotId)];
    mockedBackendService.sendSpecShots(testData);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [
        ReviewDetailsPageComponent,
        DummySpecShotDetailsComponent,
      ],
      providers: [
        { provide: BackendService, useValue: mockedBackendService },
        { provide: ActivatedRoute, useValue: {
          params: routeParams$b.asObservable(),
        }}
      ],
    })
    .compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(ReviewDetailsPageComponent);
    component = fixture.componentInstance;
    await whenAllChangesDone();
  });

  it('should create',
    () => expect(component).toBeTruthy(),
  );

  it('should contain spec shot details',
    () => expect(findSpecShotDetails().specShot).toBe(testData[0]),
  );

  it('should forward approvements', async () => {
    const approveSpy = spyOn(mockedBackendService, 'approve').and.callThrough();
    const specShotDetails = findSpecShotDetails();

    specShotDetails.vote.emit(true);
    await whenAllChangesDone();

    expect(approveSpy).toHaveBeenCalledWith(specShotId);
  });

  it('should forward disapprovements', async () => {
    const approveSpy = spyOn(mockedBackendService, 'disapprove').and.callThrough();
    const specShotDetails = findSpecShotDetails();

    specShotDetails.vote.emit(false);
    await whenAllChangesDone();

    expect(approveSpy).toHaveBeenCalledWith(specShotId);
  });

  it ('should navigate to next spec shot after vote', async () => {
    // given
    const router: Router = fixture.debugElement.injector.get(Router);
    const navigationSpy = spyOn(router, 'navigate').and.callFake(async (args) => {
      routeParams$b.next({ specShotId: args[1] });
      return true;
    });
    const specShotDetails = findSpecShotDetails();
    if (specShotDetails.specShot.id !== testData[0].id) {
      throw new Error('did not show expected initial spec shot');
    }

    // when
    findSpecShotDetails().vote.emit(false);
    await whenAllChangesDone();
    await whenAllChangesDone();

    // then
    expect(navigationSpy).toHaveBeenCalledWith([jasmine.anything(), testData[1].id]);
    expect(component.specShot.id).toBe(testData[1].id, 'component not updated');
    expect(findSpecShotDetails().specShot.id).toBe(testData[1].id, 'child not updated');
  });

  it ('should navigate to index after last vote', async () => {
    // given
    const lastSpecShotId = testData[testData.length -1].id;
    routeParams$b.next({ specShotId: lastSpecShotId });
    await whenAllChangesDone();

    const router: Router = fixture.debugElement.injector.get(Router);
    const navigationSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(false));
    const specShotDetails = findSpecShotDetails();
    if (specShotDetails.specShot.id !== lastSpecShotId) {
      throw new Error('did not show expected initial spec shot');
    }

    // when
    specShotDetails.vote.emit(false);
    await whenAllChangesDone();

    // then
    expect(navigationSpy).toHaveBeenCalledWith(['review']);
  });

  async function whenAllChangesDone() {
    await whenAllChangesDoneFor(fixture);
  }

  function findSpecShotDetails(): DummySpecShotDetailsComponent {
    const specShotDetails = fixture.debugElement.query(By.directive(DummySpecShotDetailsComponent));
    if (!specShotDetails) {
      throw new Error('spec shot details not found');
    }
    return specShotDetails.componentInstance;
  }
});
