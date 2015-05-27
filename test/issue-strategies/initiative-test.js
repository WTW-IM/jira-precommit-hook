import * as initStrat from '../../src/issue-strategies/initiative.js';
import DummyJira from '../dummy-jira.js';

let dummyJira = new DummyJira();

describe('Initiative Strategy Apply Tests', () => {
  it('Should not be able to commit against Initiative, should throw error', () =>
    initStrat.apply(dummyJira.issues.TW6).should.eventually.be.rejectedWith(Error)
  );
});
