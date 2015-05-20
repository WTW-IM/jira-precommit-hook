import * as oneStrat from '../../src/validation-strategies/has-one-issue.js';

describe('One issue exist apply tests', () => {
  it('Has at least one issue', () => {
    let testIssues = ['TW1'];
    oneStrat.apply(testIssues).should.eventually.equal(true);
  });

  it('Does not have any issues, should be rejected', () => {
    let testIssues = [];
    oneStrat.apply(testIssues).should.eventually.be.rejectedWith(Error);
  });
});
