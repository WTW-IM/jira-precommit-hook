import * as epicStrat from '../../src/issue-strategies/epic.js';
import DummyJira from '../dummy-jira.js';

describe('Epic Strategy Apply Tests', () => {
  let dummyJira;

  beforeEach(() => {
    dummyJira = new DummyJira();
  });

  it('Should not be able to commit against Epic, should throw error', () =>
    epicStrat.apply(dummyJira.issues.Epic1).should.eventually.be.rejectedWith(Error)
  );
});
