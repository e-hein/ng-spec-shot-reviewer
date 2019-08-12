import { mkdirRecursive, canReadFsNode } from './utility.functions';
import { expect } from 'chai';
import * as path from 'path';

describe('utility-functions', function() {
  it('mkdirRecursive', () => {
    const pathParts = ['tmp', '1', '2', '3'];
    const dir = path.join(process.cwd(), ...pathParts);
    expect(canReadFsNode(dir)).to.equal(false, 'test dir already exists');

    mkdirRecursive(dir);
    expect(canReadFsNode(dir)).to.be.equal(true, 'did not create directory');
  });
});
