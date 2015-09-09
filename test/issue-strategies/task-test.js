import * as taskStrat from '../../src/issue-strategies/task.js';
import DummyJira from '../dummy-jira.js';

describe('Task Strategy Apply Tests', () => {
  let dummyJira;

  beforeEach(() => {
    dummyJira = new DummyJira();
  });

  it('Should not be able to commit against a Task, should throw error', () =>
    taskStrat.apply(dummyJira.issues.Task1).should.eventually.be.rejectedWith(Error)
  );
});
