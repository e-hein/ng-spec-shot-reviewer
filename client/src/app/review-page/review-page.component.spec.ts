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
        applyApprovements: (_ids: string[]) => Promise.resolve(testData),
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
      await voteForSpecShot(true);

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
      await voteForSpecShot(false);

      // then
      expect(approveSpy).toHaveBeenCalledWith(specShotToVoteFor.id);
    }
  );

  it(
    'when voted then it should select next specshot',
    async () => {
      // given
      const specShotToVoteFor = testData[0];
      await selectSpecShot(specShotToVoteFor);
      spyOn(backend, 'disapprove').and.returnValue(Promise.resolve());

      // when
      await voteForSpecShot(false);

      // then
      const specShotDetails = findSpecShotDetails();
      expect(specShotDetails.specShot.id).toBe(testData[1].id);
    }
  );

  it(
    'when the last spec shot gets voted then it should show spec shot list again',
    async () => {
      // given
      const specShotToVoteFor = testData[testData.length - 1];
      await selectSpecShot(specShotToVoteFor);
      spyOn(backend, 'disapprove').and.returnValue(Promise.resolve());

      // when
      await voteForSpecShot(false);

      // then
      expect(() => findSpecShotList()).not.toThrow();
      expect(() => findSpecShotDetails()).toThrow();
    }
  );

  it(
    'when apply approvements then should update spec shot list',
    async () => {
      // given
      const updatedTestData = testData.slice();
      const specShotToVoteFor = updatedTestData.shift();
      spyOn(backend, 'applyApprovements').and.returnValue(Promise.resolve(updatedTestData));
      spyOn(backend, 'approve').and.returnValue(Promise.resolve());

      // when
      await selectSpecShot(specShotToVoteFor);
      await voteForSpecShot(true);
      await applyApprovements();

      // then
      expect(component.specShots).toEqual(updatedTestData);
    }
  )

  it(
    'when apply approvement for selected spec shot then it should hide spec shot details',
    async () => {
      // given
      const updatedTestData = testData.slice();
      const specShotToVoteFor = updatedTestData.shift();
      spyOn(backend, 'applyApprovements').and.returnValue(Promise.resolve(updatedTestData));
      spyOn(backend, 'approve').and.returnValue(Promise.resolve());

      // when
      await selectSpecShot(specShotToVoteFor);
      await voteForSpecShot(true);
      await selectSpecShot(specShotToVoteFor);
      await applyApprovements();

      // then
      expect(() => findSpecShotDetails()).toThrow();
    }
  )

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

  async function voteForSpecShot(vote: boolean) {
    const specShotDetails = findSpecShotDetails();
    specShotDetails.vote.emit(vote);
    await whenAllChangesDone();
  }

  async function applyApprovements() {
    const applyButton = fixture.debugElement.queryAll(By.css('button')).find((button) => button.nativeElement.innerText.includes('apply'));
    if (!applyButton) {
      throw new Error('apply button not found');
    }
    applyButton.nativeElement.click();
    await whenAllChangesDone();
  }
});
