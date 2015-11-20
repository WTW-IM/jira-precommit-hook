import * as notAllowedStrat from '../../src/issue-strategies/not-allowed.js';
import DummyJira from '../dummy-jira.js';

let dummyJira = new DummyJira();

describe('Epic Strategy Apply Tests', () => {
  it('Should not be able to commit against Epic, should throw error', () =>
    notAllowedStrat.apply(dummyJira.issues.Epic1).should.eventually.be.rejectedWith(Error)
  );
});
