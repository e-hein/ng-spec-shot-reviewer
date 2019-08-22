import { SpecShot, SpecShotFile } from 'api';

export const useDefault = undefined;
export const doNotSet = null;

let nextTimeOffset = 0;

function simpleHashFrom(text: string, max = 1000) {
  return Array.from(text).reduce((sum, char, i) => sum + char.charCodeAt(0) * i, 0) % max;
}

export function createSpecShotFile(filename: string) {
  return {
    filename,
    size: simpleHashFrom(filename),
    timestamp: Date.now() + nextTimeOffset++,
  }
}

export function createSpecShot(
  id: string,
  title = id + ' title',
  actual: SpecShotFile | null = createSpecShotFile('actual-' + id),
  diff: SpecShotFile | null = createSpecShotFile('diff-' + id),
  baseline: SpecShotFile | null = createSpecShotFile('baseline-' + id),
  approved = false
) {
  return {
    id,
    title,
    actual: actual === doNotSet ? undefined : actual,
    diff: actual === doNotSet ? undefined : diff,
    baseline: actual === doNotSet ? undefined : baseline,
    approved,
  } as SpecShot;
}

export function createSpecShotList(count = 10) {
  return new Array(count).fill(true).map((_, i) => createSpecShot(
    '#' + i, useDefault,
    i % 2 > 0 ? useDefault : doNotSet,
    i % 3 > 0 ? useDefault : doNotSet,
    i % 4 > 0 ? useDefault : doNotSet,
    i % 5 > 0,
  ));
}
