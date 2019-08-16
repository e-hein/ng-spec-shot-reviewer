import { SpecShot } from 'api';

function simpleHashFrom(text: string, max = 1000) {
  return Array.from(text).reduce((sum, char, i) => sum + char.charCodeAt(0) * i, 0) % max;
}

export function createSpecShotFile(filename: string) {
  return {
    filename,
    size: simpleHashFrom(filename),
    timestamp: Date.now(),
  }
}

export function createSpecShot(id: string) {
  return {
    id,
    title: id + ' title',
    actual: createSpecShotFile('actual-' + id),
    diff: createSpecShotFile('diff-' + id),
    baseline: createSpecShotFile('baseline-' + id),
  } as SpecShot;
}

export function createSpecShotList(count = 3) {
  return new Array(count).fill(true).map((_, i) => createSpecShot('#' + i));
}
