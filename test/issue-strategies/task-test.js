import * as notAllowedStrat from '../../src/issue-strategies/not-allowed.js';
import DummyJira from '../dummy-jira.js';

const dummyJira = new DummyJira();

describe('Task Strategy Apply Tests', () => {
  it('Should not be able to commit against a Task, should throw error', () =>
    expect(() => notAllowedStrat.apply(dummyJira.issues.Task1))
      .to.throw(/Cannot commit against Task1. It is of type Task./)
  );
});
