import * as bugMtStrat from '../../src/issue-strategies/bug-maintenance.js';
import issueGenerator from '../issue-generator.js';

let issues = {
  TW1: issueGenerator('TW1', 'Bug', 'yellow'),
  TW2: issueGenerator('TW2', 'Bug', 'green'),
  TW3: issueGenerator('TW3', 'MT', 'yellow'),
  TW4: issueGenerator('TW4', 'MT', 'green')
};

describe('Bug and Maintenance Strategy Apply Tests', () => {
  it('Bug open to commit against', done => {
    bugMtStrat.apply(issues.TW1).should.eventually.eql(true).notify(done);
  });

  it('Bug closed', done => {
    bugMtStrat.apply(issues.TW2).should.eventually.be.rejectedWith(Error).notify(done);
  });

  it('Maintenance Task open to commit against', done => {
    bugMtStrat.apply(issues.TW3).should.eventually.eql(true).notify(done);
  });

  it('Maintenance Task closed', done => {
    bugMtStrat.apply(issues.TW4).should.eventually.be.rejectedWith(Error).notify(done);
  });
});
