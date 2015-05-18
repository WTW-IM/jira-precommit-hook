import * as initStrat from '../../src/issue-strategies/initiative.js';
import issueGenerator from '../issue-generator.js';

let issues = {
  TW1: issueGenerator('TW1', 'Initiative', 'yellow')
};

let dummyClientAPI;

describe('Initiative Strategy Apply Tests', () => {
  before(() => {
    dummyClientAPI = {
      findIssue(issueKey) {
        return Promise.resolve(issues[issueKey]);
      }
    };
  });

  it('Should not be able to commit against Initiative, should throw error', () => {
    return dummyClientAPI.findIssue('TW1')
      .then(issue =>
        initStrat.apply(issue, dummyClientAPI).should.eventually.be.rejected
      );
  });
});
