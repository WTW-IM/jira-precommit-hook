import * as bugMtStrat from '../../src/issue-strategies/bug-maintenance.js';
import issueGenerator from '../issue-generator.js';

let issues = {
  TW1: issueGenerator('TW1', 'Bug', 'yellow'),
  TW2: issueGenerator('TW2', 'Bug', 'green'),
  TW3: issueGenerator('TW3', 'MT', 'yellow'),
  TW4: issueGenerator('TW4', 'MT', 'green')
};

let dummyClientAPI;

describe('Bug and Maintenance Strategy Apply Tests', () => {
  before(() => {
    dummyClientAPI = {
      findIssue(issueKey) {
        return Promise.resolve(issues[issueKey]);
      }
    };
  });

  it('Bug open to commit against', () => {
    return dummyClientAPI.findIssue('TW1')
      .then(issue =>
        bugMtStrat.apply(issue, dummyClientAPI).should.eventually.eql(true)
      );
  });

  it('Bug closed', () => {
    return dummyClientAPI.findIssue('TW2')
      .then(issue =>
        bugMtStrat.apply(issue, dummyClientAPI).should.eventually.be.rejected
      );
  });

  it('Maintenance Task open to commit against', () => {
    return dummyClientAPI.findIssue('TW3')
      .then(issue =>
        bugMtStrat.apply(issue, dummyClientAPI).should.eventually.eql(true)
      );
  });

  it('Maintenance Task closed', () => {
    return dummyClientAPI.findIssue('TW4')
      .then(issue =>
        bugMtStrat.apply(issue, dummyClientAPI).should.eventually.be.rejected
      );
  });
});
