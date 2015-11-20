import * as notAllowedStrat from '../../src/issue-strategies/not-allowed.js';
import DummyJira from '../dummy-jira.js';

let dummyJira = new DummyJira();

describe('Initiative Strategy Apply Tests', () => {
  it('Should not be able to commit against Initiative, should throw error', () =>
    notAllowedStrat.apply(dummyJira.issues.I1).should.eventually.be.rejectedWith(Error)
  );
});
