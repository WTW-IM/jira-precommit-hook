import* as storyStrat from '../../src/issue-strategies/story.js';
import issueGenerator from '../issue-generator.js';

let dummyClientAPI = null;
let dummyJira = null;

let issues = {
  PM100: issueGenerator('PM100', 'Initiative', 'yellow'),
  TW100: issueGenerator('TW100', 'Epic', 'yellow', 'PM100'),
  TW101: issueGenerator('TW101', 'Story', 'yellow', 'TW100', 'Epic'),
  TW102: issueGenerator('TW102', 'Sub-task', 'yellow', 'TW101'),
  TW103: issueGenerator('TW103', 'Story', 'yellow', 'PM100', 'Initiative'),
  PM200: issueGenerator('PM200', 'Initiative', 'red'),
  TW200: issueGenerator('TW200', 'Epic', 'red', 'PM100'),
  TW201: issueGenerator('TW201', 'Story', 'yellow', 'TW201', 'Epic'),
  TW202: issueGenerator('TW202', 'Story', 'red', 'TW201', 'Epic'),
  TW203: issueGenerator('TW203', 'Sub-task', 'yellow', 'TW202'),
  TW204: issueGenerator('TW204', 'Sub-task', 'red', 'TW202'),
  TW205: issueGenerator('TW205', 'Story', 'yellow', 'PM200', 'Initiative'),
  TW206: issueGenerator('TW206', 'Sub-task', 'yellow', 'TW201'),
  TW207: issueGenerator('TW207', 'Sub-task', 'yellow', 'TW205')
};

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
  before(() => {
    dummyJira = {
      findIssue(issueKey) {
        return Promise.resolve(issues[issueKey]);
      }
    };
  });

  describe('Okay to commit against', () => {
    it('Sub-task is yellow and all the parents up to the initiative are yellow', done => {
      storyStrat.apply('TW102', dummyJira).should.eventually.eql(true).notify(done);
    });

    it('Story is yellow and all the parents up the initiative are yellow', done => {
      storyStrat.apply('TW101', dummyJira).should.eventually.eql(true).notify(done);
      storyStrat.apply('TW103', dummyJira).should.eventually.eql(true).notify(done);
    });
  });

  describe('Should not be able to commit against', () => {
    it('Sub-task not yellow', done => {
      storyStrat.apply('TW204', dummyJira).should.eventually.eql(false).notify(done);
    });

    it('Sub-task is yellow, but the story is not', done => {
      storyStrat.apply('TW203', dummyJira).should.eventually.eql(false).notify(done);
    });

    it('Sub-task is yellow, but the epic is not', done => {
      storyStrat.apply('TW206', dummyJira).should.eventually.eql(false).notify(done);
    });

    it('Sub-task is yellow, but the initiative is not', done => {
      storyStrat.apply('TW207', dummyJira).should.eventually.eql(false).notify(done);
    });

    it('Story not yellow', done => {
      storyStrat.apply('TW202', dummyJira).should.eventually.eql(false).notify(done);
    });

    it('Story is yellow, but the epic is not', done => {
      storyStrat.apply('TW201', dummyJira).should.eventually.eql(false).notify(done);
    });

    it('Story is yellow, but the initiative is not', done => {
      storyStrat.apply('TW205', dummyJira).should.eventually.eql(false).notify(done);
    });
  });
});
