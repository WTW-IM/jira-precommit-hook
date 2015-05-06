import* as bugStrat from '../../src/strategies/bug.js';

describe('Bug Strategy Tests', () => {
  it('Bad match', () => {
    bugStrat.matches('bug').should.eql(false);
  });

  it('Good match', () => {
    bugStrat.matches('Bug').should.eql(true);
  });
});
