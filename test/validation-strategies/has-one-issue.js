import * as oneStrat from '../../src/validation-strategies/has-one-issue.js';
import issueGenerator from '../issue-generator.js';

let issues = {
  TW1: issueGenerator('TW1', 'Bug', 'yellow')
};

let dummyClientAPI = null;

describe('One issue exist apply tests', () => {
  before(() => {
    dummyClientAPI = {
      findIssue(issueKey) {
        return Promise.resolve(issues[issueKey]);
      }
    };
  });

  it('Has at least one issue', done => {
    let testIssues = ['TW1'];
    oneStrat.apply(testIssues, dummyClientAPI).should.eventually.eql(true).notify(done);
  });

  it('Does not have any issues, should be rejected', done => {
    let testIssues = [];
    oneStrat.apply(testIssues, dummyClientAPI).should.eventually.be.rejected.notify(done);
  });
});
