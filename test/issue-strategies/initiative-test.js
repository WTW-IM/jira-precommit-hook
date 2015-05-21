import * as initStrat from '../../src/issue-strategies/initiative.js';
import issueGenerator from '../issue-generator.js';

let issues = {
  TW1: issueGenerator('TW1', 'Initiative', 'yellow')
};

describe('Initiative Strategy Apply Tests', () => {
  it('Should not be able to commit against Initiative, should throw error', () =>
    initStrat.apply(issues.TW1).should.eventually.be.rejectedWith(Error)
  );
});
