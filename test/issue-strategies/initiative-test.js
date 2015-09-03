import * as initStrat from '../../src/issue-strategies/initiative.js';
import DummyJira from '../dummy-jira.js';

describe('Initiative Strategy Apply Tests', () => {
  let dummyJira;

  beforeEach(() => {
    dummyJira = new DummyJira();
  });
  it('Should not be able to commit against Initiative, should throw error', () =>
    initStrat.apply(dummyJira.issues.I1).should.eventually.be.rejectedWith(Error)
  );
});
