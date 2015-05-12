import * as bugStrat from '../../src/issue-strategies/bug.js';
import issueGenerator from '../issue-generator.js';

let issues = {
  TW1: issueGenerator('TW1', 'Bug', 'yellow'),
  TW2: issueGenerator('TW2', 'Bug', 'green')
};


describe('Bug Strategy Match Tests', () => {
  it('Bad match', () => {
    bugStrat.matches('bug').should.eql(false);
    bugStrat.matches().should.eql(false);
  });

  it('Good match', () => {
    bugStrat.matches('Bug').should.eql(true);
  });
});

let dummyClientAPI;

describe('Bug Strategy Apply Tests', () => {
  before(() => {
    dummyClientAPI = {
      findIssue(issueKey) {
        return Promise.resolve(issues[issueKey]);
      }
    };
  });

  it('Bug open to commit against', done => {
    bugStrat.apply('TW1', dummyClientAPI).should.eventually.eql(true).notify(done);
  });

  it('Bug closed', done => {
    bugStrat.apply('TW2', dummyClientAPI).should.eventually.eql(false).notify(done);
  });
});
