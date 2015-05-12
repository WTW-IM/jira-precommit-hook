import * as mtStrat from '../../src/issue-strategies/maintenance.js';
import issueGenerator from '../issue-generator.js';

let issues = {
  TW1: issueGenerator('TW1', 'MT', 'yellow'),
  TW2: issueGenerator('TW2', 'MT', 'green')
};


let dummyClientAPI = null;

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
    dummyClientAPI = {
      findIssue(issueKey) {
        return Promise.resolve(issues[issueKey]);
      }
    };
  });

  it('Maintenance Task open to commit against', done => {
    mtStrat.apply('TW1', dummyClientAPI).should.eventually.eql(true).notify(done);
  });

  it('Maintenance Task closed', done => {
    mtStrat.apply('TW2', dummyClientAPI).should.eventually.eql(false).notify(done);
  });
});
