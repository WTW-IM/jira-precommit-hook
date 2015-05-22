import allStrat from '../../src/validation-strategies/all-issues-exist.js';
import DummyJira from '../dummy-jira.js';

let dummyJira = new DummyJira();

describe('All issues exist apply tests', () => {
  it('All issues exist', () => {
    let testIssues = ['TW6', 'TW9', 'TW10'];
    return allStrat(testIssues, dummyJira).should.eventually.equal(true);
  });

  it('At least one issue does not exist, should error', () => {
    let testIssues = ['TW15'];
    return allStrat(testIssues, dummyJira).should.eventually.be.rejectedWith(Error);
  });
});
