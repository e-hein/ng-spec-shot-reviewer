import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SpecShot } from 'api';
import { whenAllChangesDoneFor } from 'utils/testing/common.functions';
import { createSpecShotList } from 'utils/testing/spec-shot.test-data';
import { BackendService } from '../backend.service';
import { MockedBackendService } from '../mocked-backend.service';
import { SpecShotListComponent } from '../spec-shot-list/spec-shot-list.component';
import { ReviewOverviewPageComponent } from './review-overview-page.component';

@Component({
  selector: 'ssr-spec-shot-list',
  template: 'dummy spec shot list length: {{specShots.length}}',
})
class DummySpecShotListComponent extends SpecShotListComponent {}

describe('ReviewOverviewPageComponent', () => {
  let mockedBackendService: MockedBackendService;
  let testData: SpecShot[];
  let component: ReviewOverviewPageComponent;
  let fixture: ComponentFixture<ReviewOverviewPageComponent>;

  beforeEach(async(() => {
    mockedBackendService = new MockedBackendService();
    testData = createSpecShotList();
    mockedBackendService.sendSpecShots(testData);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [
        ReviewOverviewPageComponent,
        DummySpecShotListComponent,
      ],
      providers: [ { provide: BackendService, useValue: mockedBackendService } ],
    })
    .compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(ReviewOverviewPageComponent);
    component = fixture.componentInstance;
    await whenAllChangesDone();
  });

  it('should create',
    () => expect(component).toBeTruthy(),
  );

  it('should contain a spec shot list',
    () => expect(findSpecShotList().specShots.length).toBeGreaterThan(0),
  );

  it('should only show spec shots with changes',
    () => expect(findSpecShotList().specShots.length).toBeLessThan(testData.length),
  );

  it('when spec shot selected in spec shot list then it should navigate on spec shot selection', async () => {
    const navigationSpy = spyOn(fixture.debugElement.injector.get(Router), 'navigate');

    await selectSpecShot(testData[0]);

    expect(navigationSpy).toHaveBeenCalledWith([testData[0].id], jasmine.anything());
  });

  it(
    'when apply approvements then it should update spec shot list',
    async () => {
      // given
      const specShots = (await findSpecShotList()).specShots;
      if (!specShots.some((specShot) => specShot.approved)) {
        throw new Error('there are no approved spec shots');
      }
      const oldLength = specShots.length;

      // when
      await applyApprovements();

      // then
      const newLength = (await findSpecShotList()).specShots.length;
      expect(newLength).toBeLessThan(oldLength);
    }
  );

  it(
    'when there are no approved spec shots then should hide apply button',
    async () => {
      // given
      await applyApprovements();
      if ((await findSpecShotList()).specShots.some((specShot) => specShot.approved)) {
        throw new Error('there are still approved spec shots');
      }

      // then
      expect(findApplyButton).toThrow();
    }
  );

  async function whenAllChangesDone() {
    await whenAllChangesDoneFor(fixture);
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

  function findApplyButton(): HTMLButtonElement {
    const applyButton = fixture.debugElement.queryAll(By.css('button')).find((button) => button.nativeElement.innerText.includes('apply'));
    if (!applyButton) {
      throw new Error('apply button not found');
    }
    return applyButton.nativeElement;
  }

  async function applyApprovements() {
    findApplyButton().click();
    await whenAllChangesDone();
  }
});
