import allStrat from '../../src/validation-strategies/all-issues-exist.js';
import issueGenerator from '../issue-generator.js';

let issues = {
  TW1: issueGenerator('TW1', 'Initiative', 'yellow'),
  TW2: issueGenerator('TW2', 'Epic', 'green'),
  TW3: issueGenerator('TW3', 'Story', 'green'),
  TW4: issueGenerator('TW4', 'MT', 'yellow'),
  TW5: issueGenerator('TW5', 'Bug', 'yellow'),
  TW6: issueGenerator('TW6', 'Story', 'green'),
  TW7: issueGenerator('TW7', 'Sub-task', 'green')
};

let dummyClientAPI = null;

describe('All issues exist apply tests', () => {
  before(() => {
    dummyClientAPI = {
      findIssue(issueKey) {
        if(issues[issueKey] === undefined) {
          return Promise.reject(new Error(`Issue ${issueKey} does not exist.`));
        }
        return Promise.resolve(issues[issueKey]);
      }
    };
  });

  it('All issues exist', done => {
    let testIssues = ['TW1', 'TW4', 'TW7'];
    allStrat(testIssues, dummyClientAPI).should.eventually.equal(true).notify(done);
  });

  it('At least one issue does not exist, should error', done => {
    let testIssues = ['TW9'];
    allStrat(testIssues, dummyClientAPI).should.eventually.be.rejectedWith(Error).notify(done);
  });
});
