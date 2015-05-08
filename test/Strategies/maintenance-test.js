import* as mtStrat from '../../src/strategies/maintenance.js';
import* as fsUtils from '../../src/fs-utils.js';
import path from 'path';

describe('Maintenance Task Strategy Tests', () => {
  it('Bad match', () => {
    mtStrat.matches('Epic').should.eql(false);
    mtStrat.matches().should.eql(false);
  });

  it('Good match', () => {
    mtStrat.matches('Maintenance Task').should.eql(true);
  });
});

describe('Maintenance Task Strategy Apply Tests', () => {
  before(() => {
    sinon.stub(mtStrat, 'apply', issueKey => {
      let issueFileDir = fsUtils.getFilePath(path.join('test', 'test-issues'), `${issueKey}.json`);
      return fsUtils.readJSON(issueFileDir)
        .then(content => {
          return content !== null && content.fields.status.statusCategory.colorName === 'yellow';
        });
    });
  });

  it('Maintenance Task open to commit against', done => {
    mtStrat.apply('TW-5000').should.eventually.eql(true).notify(done);
  });

  it('Maintenance Task closed', done => {
    mtStrat.apply('TW-5001').should.eventually.eql(false).notify(done);
  });

  after(() => {
    mtStrat.apply.restore();
  });
});
