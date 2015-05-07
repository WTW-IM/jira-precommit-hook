import* as bugStrat from '../../src/strategies/bug.js';
import* as fsUtils from '../../src/fs-utils.js';
import path from 'path';

describe('Bug Strategy Match Tests', () => {
  it('Bad match', () => {
    bugStrat.matches('bug').should.eql(false);
    bugStrat.matches().should.eql(false);
  });

  it('Good match', () => {
    bugStrat.matches('Bug').should.eql(true);
  });
});

describe('Bug Strategy Apply Tests', () => {
  before(() => {
    sinon.stub(bugStrat, 'apply', issueKey => {
      let issueFileDir = fsUtils.getFilePath(path.join('test', 'test-issues'), `${issueKey}.json`);
      return fsUtils.readJSON(issueFileDir)
        .then(content => {
          if(content === null || content.fields.status.statusCategory.colorName !== 'yellow') {
            return false;
          }
          return true;
        });
    });
  });

  it('Bug open to commit against', done => {
    bugStrat.apply('TW-4000').should.eventually.eql(true).notify(done);
  });

  it('Bug closed', done => {
    bugStrat.apply('TW-4001').should.eventually.eql(false).notify(done);
  });

  after(() => {
    bugStrat.apply.restore();
  });
});
