import { TestBed } from '@angular/core/testing';
import { BackendService } from '../backend.service';
import { MockedBackendService } from '../mocked-backend.service';
import { createSpecShot, useDefault } from 'utils/testing/spec-shot.test-data';
import { SpecShot } from 'api';
import { ReviewService } from './review.service';
import { take } from 'rxjs/operators';

const testData = [
  createSpecShot('nothing', 'nothing', null, null, null, true),
  createSpecShot('actual', 'actual', useDefault, null, null, false),
  createSpecShot('actual-diff', 'actual-diff', useDefault, useDefault, null, true),
  createSpecShot('actual-diff-baseline', 'actual-diff-baseline', useDefault, useDefault, useDefault, false),
  createSpecShot('actual-baseline', 'actual-baseline', useDefault, null, useDefault, true),
  createSpecShot('diff', 'diff', null, useDefault, null, false),
  createSpecShot('diff-baseline', 'diff-baseline', null, useDefault, useDefault, true),
  createSpecShot('baseline', 'baseline', null, null, useDefault, false),
];
const byId = testData.reduce((indexed, next) => indexed.set(next.id, next), new Map<string, SpecShot>());

describe('review service', () => {
  let mockedBackendService: MockedBackendService;
  let reviewService: ReviewService;

  beforeEach(() => {
    mockedBackendService = new MockedBackendService();

    TestBed.configureTestingModule({
      providers: [
        { provide: BackendService, useValue: mockedBackendService },
      ]
    });

    reviewService = TestBed.get(ReviewService);
  });

  describe('specShots', () => {
    it('should only show specshots without baseline or with changes', async () => {
      mockedBackendService.sendSpecShots(testData);

      const specShotsToShow = await reviewService.specShots.pipe(take(1)).toPromise();

      expect(specShotsToShow).toContain(byId.get('actual'));
      expect(specShotsToShow).toContain(byId.get('actual-diff-baseline'));
      expect(specShotsToShow).not.toContain(byId.get('actual-baseline'));
      expect(specShotsToShow).not.toContain(byId.get('baseline'));
    });

    it('should sort specshots', async () => {
      const anotherSpecShot = createSpecShot('new', 'new', useDefault, useDefault, useDefault, false);

      mockedBackendService.sendSpecShots([anotherSpecShot].concat(testData.reverse()));
      const newOrder = (await reviewService.specShots.pipe(take(1)).toPromise()).map(({id}) => id);

      expect(newOrder.pop()).toBe('new');
      expect(newOrder[0]).toBe('actual');
    });
  });

  describe('approvedSpecShots', () => {
    it('should only return approved spec shots', async () => {
      mockedBackendService.sendSpecShots(testData);

      const specShots = await reviewService.approvedSpecShots.pipe(take(1)).toPromise();

      expect(specShots.length).toBeGreaterThan(0);
      expect(specShots.length).toBeLessThan(testData.length);
      expect(specShots).not.toContain(jasmine.objectContaining({ approved: false}));
    });
  });
});
