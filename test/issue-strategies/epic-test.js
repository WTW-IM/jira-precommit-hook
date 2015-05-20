import * as epicStrat from '../../src/issue-strategies/epic.js';
import issueGenerator from '../issue-generator.js';

let issues = {
  TW1: issueGenerator('TW1', 'Epic', 'yellow')
};

let dummyClientAPI;

describe('Epic Strategy Apply Tests', () => {
  before(() => {
    dummyClientAPI = {
      findIssue(issueKey) {
        return Promise.resolve(issues[issueKey]);
      }
    };
  });

  it('Should not be able to commit against Epic, should throw error', done => {
    epicStrat.apply(issues.TW, dummyClientAPI).should.eventually.be.rejected.notify(done);
  });
});
