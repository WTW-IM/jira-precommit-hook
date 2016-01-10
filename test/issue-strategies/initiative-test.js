import * as notAllowedStrat from '../../src/issue-strategies/not-allowed.js';
import DummyJira from '../dummy-jira.js';

const dummyJira = new DummyJira();

describe('Initiative Strategy Apply Tests', () => {
  it('Should not be able to commit against Initiative, should throw error', () =>
    expect(() => notAllowedStrat.apply(dummyJira.issues.I1))
      .to.throw(/Cannot commit against I1. It is of type Initiative./)
  );
});
