import* as storyStrat from '../../src/strategies/story.js';

describe('Story/Sub-task Strategy Match Tests', () => {
  it('Bad match', () => {
    storyStrat.matches('Bug').should.eql(false);
    storyStrat.matches().should.eql(false);
  });

  it('Good match', () => {
    storyStrat.matches('Story').should.eql(true);
    storyStrat.matches('Sub-task').should.eql(true);
  });
});

describe('Story/Sub-task Strategy Apply Tests', () => {
  it('Open to commit against', () => {

  });

  it('Closed', () => {

  });
});
