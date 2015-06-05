import * as bugMtStrat from '../../src/issue-strategies/bug-maintenance.js';
import DummyJira from '../dummy-jira.js';

let dummyJira = new DummyJira();

describe('Bug and Maintenance Strategy Apply Tests', () => {
  it('Bug open to commit against', () =>
    bugMtStrat.apply(dummyJira.issues.TW1, dummyJira).should.eventually.eql(true)
  );

  it('Bug closed', () =>
    bugMtStrat.apply(dummyJira.issues.TW2, dummyJira).should.eventually.be.rejectedWith(Error)
  );

  it('Maintenance Task open to commit against', () =>
    bugMtStrat.apply(dummyJira.issues.TW3, dummyJira).should.eventually.eql(true)
  );

  it('Maintenance Task closed', () =>
    bugMtStrat.apply(dummyJira.issues.TW4, dummyJira).should.eventually.be.rejectedWith(Error)
  );
});
