import * as epicStrat from '../../src/issue-strategies/epic.js';
import DummyJira from '../dummy-jira.js';

let dummyJira = new DummyJira();

describe('Epic Strategy Apply Tests', () => {
  it('Should not be able to commit against Epic, should throw error', () =>
    epicStrat.apply(dummyJira.issues.TW5).should.eventually.be.rejectedWith(Error)
  );
});
