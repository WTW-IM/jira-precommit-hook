import* as storyStrat from '../../src/strategies/story.js';

describe('Story Strategy Tests', () => {
  it('Bad match', () => {
    storyStrat.matches('Bug').should.eql(false);
    storyStrat.matches().should.eql(false);
  });

  it('Good match', () => {
    storyStrat.matches('Story').should.eql(true);
  });
});

describe('Sub-task Strategy Tests', () => {
  it('Bad match', () => {
    storyStrat.matches('subtask').should.eql(false);
  });

  it('Good match', () => {
    storyStrat.matches('Sub-task').should.eql(true);
  });
});
