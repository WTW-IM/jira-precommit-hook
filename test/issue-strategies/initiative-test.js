import * as notAllowedStrat from '../../src/issue-strategies/not-allowed.js';
import DummyJira from '../dummy-jira.js';

const dummyJira = new DummyJira();

describe('Initiative Strategy Apply Tests', () => {
  it('Should not be able to commit against Initiative, should throw error', () =>
    notAllowedStrat.apply(dummyJira.issues.I1).should.eventually.be.rejectedWith(/Cannot commit against I1. It is of type Initiative./)
  );
});
