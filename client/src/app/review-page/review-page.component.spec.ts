import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SpecShot } from 'api';
import { whenAllChangesDoneFor } from 'utils/testing/common.functions';
import { createSpecShotList } from 'utils/testing/spec-shot.test-data';
import { BackendService } from '../backend.service';
import { PageLayoutComponent } from '../page-layout/page-layout.component';
import { SpecShotDetailsComponent } from '../spec-shot-details/spec-shot-details.component';
import { SpecShotListComponent } from '../spec-shot-list/spec-shot-list.component';
import { ReviewPageComponent } from './review-page.component';

@Component({
  selector: 'ssr-spec-shot-list',
  template: 'dummy spec shot list',
})
class DummySpecShotListComponent extends SpecShotListComponent {}

@Component({
  selector: 'ssr-spec-shot-details',
  template: 'dummy spec shot details'
})
class DummySpecShotDetailsComponent extends SpecShotDetailsComponent {}

describe('ReviewPageComponent', () => {
  let component: ReviewPageComponent;
  let fixture: ComponentFixture<ReviewPageComponent>;
  const whenAllChangesDone = () => whenAllChangesDoneFor(fixture);
  let testData: SpecShot[];
  let backend: BackendService;

  beforeEach(() => testData = createSpecShotList())

  beforeEach(async(() => TestBed.configureTestingModule({
    declarations: [
      ReviewPageComponent,
      PageLayoutComponent,
      DummySpecShotListComponent,
      DummySpecShotDetailsComponent,
    ],
    providers: [
      { provide: BackendService, useValue: {
        specShots: () => Promise.resolve(testData),
        approve: (_id: string) => Promise.resolve(),
        disapprove: (_id: string) => Promise.resolve(),
      } as BackendService },
    ]
  })
  .compileComponents()));

  beforeEach(async () => {
    fixture = TestBed.createComponent(ReviewPageComponent);
    component = fixture.componentInstance;
    backend = fixture.debugElement.injector.get(BackendService);
    spyOn(backend, 'specShots').and.returnValue(Promise.resolve(testData));
    await whenAllChangesDone();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function findSpecShotDetails(): DummySpecShotDetailsComponent {
    const specShotDetails = fixture.debugElement.query(By.directive(DummySpecShotDetailsComponent));
    if (!specShotDetails) {
      throw new Error('spec shot details not found');
    }
    return specShotDetails.componentInstance;
  }

  function findSpecShotList(): DummySpecShotListComponent {
    const specShotList = fixture.debugElement.query(By.directive(DummySpecShotListComponent));
    if (!specShotList) {
      throw new Error('spec shot list not found');
    }
    return specShotList.componentInstance;
  }

  async function selectSpecShot(specShotToSelect: SpecShot) {
    const specShotList = findSpecShotList();
    if (!specShotList.specShots.some((specShot) => specShot.id === specShotToSelect.id)) {
      throw new Error('spec shot not in list');
    }

    specShotList.select.emit(specShotToSelect);
    await whenAllChangesDone();
  }

  async function vorForSpecShot(vote: boolean) {
    const specShotDetails = findSpecShotDetails();
    specShotDetails.vote.emit(vote);
    await whenAllChangesDone();
  }

  it(
    'should contain a spec shot list',
    () => expect(() => findSpecShotList()).not.toThrow(),
  );

  it(
    'when spec shot selected in spec shot list then it should it\'s show details',
    async () => {
      // given
      const specShotToSelect = testData[0];

      // when
      await selectSpecShot(specShotToSelect);

      // then
      const specShotDetails = findSpecShotDetails();
      expect(specShotDetails.specShot.id).toBe(specShotToSelect.id);
    }
  );

  it(
    'when voted true for an spec shot then it should send approvement to backend',
    async () => {
      // given
      const specShotToVoteFor = testData[0];
      await selectSpecShot(specShotToVoteFor);
      const approveSpy = spyOn(backend, 'approve').and.returnValue(Promise.resolve());

      // when
      await vorForSpecShot(true);

      // then
      expect(approveSpy).toHaveBeenCalledWith(specShotToVoteFor.id);
    }
  );

  it(
    'when voted false for an spec shot then it should send disapprovement to backend',
    async () => {
      // given
      const specShotToVoteFor = testData[0];
      await selectSpecShot(specShotToVoteFor);
      const approveSpy = spyOn(backend, 'disapprove').and.returnValue(Promise.resolve());

      // when
      await vorForSpecShot(false);

      // then
      expect(approveSpy).toHaveBeenCalledWith(specShotToVoteFor.id);
    }
  );
});
