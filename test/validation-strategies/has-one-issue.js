import oneStrat from '../../src/validation-strategies/has-one-issue.js';

describe('One issue exist apply tests', () => {
  it('Has at least one issue', () => {
    const testIssues = ['TW1'];
    oneStrat(testIssues).should.equal(true);
  });

  it('Does not have any issues, should be rejected', () => {
    const testIssues = [];
    expect(() => oneStrat(testIssues))
      .to.throw(Error, /Must commit against at least one issue./);
  });
});
