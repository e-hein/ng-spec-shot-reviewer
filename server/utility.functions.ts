import { accessSync, mkdir, mkdirSync } from "fs";
import { R_OK } from 'constants';
import * as path from 'path';

export function canReadFsNode(fsnode: string, accessMode = R_OK) {
  try {
    accessSync(fsnode, accessMode);
    return true;
  } catch (e) {
    return false;
  }
}

export function mkdirRecursive(dir: string) {
  const parts = dir.split(path.sep);
  if (parts[0] === '') {
    parts[0] = '/';
  };
  console.log('mkdir parts ', dir.split(path.sep));
  parts.forEach((_, i) => {
    const toCreate = path.join(...parts.slice(0, i + 1));
    if (!canReadFsNode(toCreate)) {
      console.log('mkdir', path.resolve(toCreate));
      mkdirSync(toCreate);
    }
  });
}
