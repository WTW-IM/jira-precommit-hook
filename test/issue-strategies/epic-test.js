import * as epicStrat from '../../src/issue-strategies/epic.js';
import issueGenerator from '../issue-generator.js';

let issues = {
  TW1: issueGenerator('TW1', 'Epic', 'yellow')
};

describe('Epic Strategy Apply Tests', () => {
  it('Should not be able to commit against Epic, should throw error', () =>
    epicStrat.apply(issues.TW).should.eventually.be.rejectedWith(Error)
  );
});
