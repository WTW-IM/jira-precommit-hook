import * as bugMtStrat from '../../src/issue-strategies/bug-maintenance.js';
import DummyJira from '../dummy-jira.js';

let dummyJira = new DummyJira();

describe('Bug and Maintenance Strategy Apply Tests', () => {
  it('Bug open to commit against', () =>
    bugMtStrat.apply(dummyJira.issues.Bug1).should.eventually.eql(true)
  );

  it('Bug closed', () =>
    bugMtStrat.apply(dummyJira.issues.Bug2).should.eventually.be.rejectedWith(Error)
  );

  it('Maintenance Task open to commit against', () =>
    bugMtStrat.apply(dummyJira.issues.MT1).should.eventually.eql(true)
  );

  it('Maintenance Task closed', () =>
    bugMtStrat.apply(dummyJira.issues.MT2).should.eventually.be.rejectedWith(Error)
  );
});
