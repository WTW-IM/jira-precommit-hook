import* as mtStrat from '../../src/strategies/maintenance.js';

describe('Maintenance Task Strategy Tests', () => {
  it('Bad match', () => {
    mtStrat.matches('Epic').should.eql(false);
  });

  it('Good match', () => {
    mtStrat.matches('Maintenance Task').should.eql(true);
  });
});
