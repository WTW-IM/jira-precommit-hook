import * as notAllowedStrat from '../../src/issue-strategies/not-allowed.js';
import DummyJira from '../dummy-jira.js';

let dummyJira = new DummyJira();

describe('Task Strategy Apply Tests', () => {
  it('Should not be able to commit against a Task, should throw error', () =>
    notAllowedStrat.apply(dummyJira.issues.Task1).should.eventually.be.rejectedWith(Error)
  );
});
