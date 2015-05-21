import oneStrat from '../../src/validation-strategies/has-one-issue.js';

describe('One issue exist apply tests', () => {
  it('Has at least one issue', done => {
    let testIssues = ['TW1'];
    oneStrat(testIssues).should.eventually.equal(true).notify(done);
  });

  it('Does not have any issues, should be rejected', done => {
    let testIssues = [];
    oneStrat(testIssues).should.eventually.be.rejectedWith(Error).notify(done);
  });
});
