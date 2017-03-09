import { checkValidJSON } from '../src/deployments-config-check';

const dummyFS = {
  readFile(arg) {
    return arg;
  }
};

const dummyGoodJSON = JSON.stringify({
  someBuildType: [
    'some/directory/.*'
  ]
});

const dummyBadJSON = 'somethingthatobviously [] is not JSON';

const dummyGoodFileSystemUtils = {
  findParentFolder(cwd, filename) {
    return dummyGoodJSON;
  }
};

const dummyBadFileSystemUtils = {
  findParentFolder(cwd, filename) {
    return dummyBadJSON;
  }
};

describe('Checking Valid Hubot Deployments Config', () => {
  it('Basic Case, exists and is good', (done) => checkValidJSON({
    fileSystemUtils: dummyGoodFileSystemUtils,
    fileSystem: dummyFS
  }).should.eventually.equal(true).and.notify(done));
});

describe('Checking Valid Hubot Deployments Config', () => {
  it('File exists but is not formatted properly', (done) => checkValidJSON({
    fileSystemUtils: dummyBadFileSystemUtils,
    fileSystem: dummyFS
  }).should.eventually.equal(false).and.notify(done));
});
