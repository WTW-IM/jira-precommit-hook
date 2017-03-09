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

const dummyNotExistFileUtils = {
  findParentFolder(cwd, filename) {
    throw new Error('Cannot find hubot-deployments-config.json');
  }
};

describe('Checking Valid Hubot Deployments Config', () => {
  it('Basic Case, exists and is good', (done) => checkValidJSON({
    fileSystemUtils: dummyGoodFileSystemUtils,
    fileSystem: dummyFS
  }).should.eventually.equal(true).and.notify(done));

  it('File exists but is not formatted properly', (done) => checkValidJSON({
    fileSystemUtils: dummyBadFileSystemUtils,
    fileSystem: dummyFS
  }).should.eventually.be.rejectedWith('hubot-deployments-config.json is not a valid JSON file')
    .and.notify(done));

  it('File does not exist', (done) => checkValidJSON({
    fileSystemUtils: dummyNotExistFileUtils,
    fileSystem: dummyFS
  }).should.eventually.be.rejectedWith('Cannot find hubot-deployments-config.json')
    .and.notify(done));
});
