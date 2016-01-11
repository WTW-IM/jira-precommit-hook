import * as notAllowedStrat from '../../src/issue-strategies/not-allowed.js';
import DummyJira from '../dummy-jira.js';

const dummyJira = new DummyJira();

describe('Epic Strategy Apply Tests', () => {
  it('Should not be able to commit against Epic, should throw error', () =>
    expect(() => notAllowedStrat.apply(dummyJira.issues.Epic1))
      .to.throw(/Cannot commit against Epic1. It is of type Epic./)
  );
});
