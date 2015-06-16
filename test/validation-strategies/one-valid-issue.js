import validStrat from '../../src/validation-strategies/one-valid-issue.js';
import DummyJira from '../dummy-jira.js';

let dummyJira = new DummyJira();

describe('One valid issue apply tests', () => {
  it('1 good issue', () => {
    let testIssues = ['Story1'];
    return validStrat(testIssues, dummyJira).should.eventually.equal(true);
  });

  it('1 bad issue', () => {
    let testIssues = ['TW201'];
    return validStrat(testIssues, dummyJira).should.eventually.be.rejectedWith(Error);
  });

  it('1 good issue, 1 bad issue', () => {
    let testIssues = ['Story1', 'TW201'];
    return validStrat(testIssues, dummyJira).should.eventually.equal(true);
  });

  it('2 bad issues', () => {
    let testIssues = ['TW201', 'SubTask7'];
    return validStrat(testIssues, dummyJira).should.eventually.be.rejectedWith([new Error(), new Error()]);
  });
});
