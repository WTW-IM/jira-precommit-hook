import * as notAllowedStrat from '../../src/issue-strategies/not-allowed.js';
import DummyJira from '../dummy-jira.js';

const dummyJira = new DummyJira();

describe('Task Strategy Apply Tests', () => {
  it('Should not be able to commit against a Task, should throw error', () =>
    notAllowedStrat.apply(dummyJira.issues.Task1).should.eventually.be.rejectedWith(/Cannot commit against Task1. It is of type Task./)
  );
});
