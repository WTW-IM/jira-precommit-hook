import * as taskStrat from '../../src/issue-strategies/task.js';
import DummyJira from '../dummy-jira.js';

let dummyJira = new DummyJira();

describe('Task Strategy Apply Tests', () => {
  it('Should not be able to commit against a Task, should throw error', () =>
    taskStrat.apply(dummyJira.issues.TW11).should.eventually.be.rejectedWith(Error)
  );
});
