import * as storyStrat from '../../src/issue-strategies/story.js';
import issueGenerator from '../issue-generator.js';

let dummyClientAPI = null;
let testStrat = null;

let issues = {
  PM100: issueGenerator('PM100', 'Initiative', 'yellow'),
  TW100: issueGenerator('TW100', 'Epic', 'yellow', 'PM100', 'Initiative'),
  TW101: issueGenerator('TW101', 'Story', 'yellow', 'TW100', 'Epic'),
  TW102: issueGenerator('TW102', 'Sub-task', 'yellow', 'TW101'),
  TW103: issueGenerator('TW103', 'Story', 'yellow', 'PM100', 'Initiative'),
  PM200: issueGenerator('PM200', 'Initiative', 'red'),
  TW200: issueGenerator('TW200', 'Epic', 'red', 'PM100', 'Initiative'),
  TW201: issueGenerator('TW201', 'Story', 'yellow', 'TW200', 'Epic'),
  TW202: issueGenerator('TW202', 'Story', 'red', 'TW200', 'Epic'),
  TW203: issueGenerator('TW203', 'Sub-task', 'yellow', 'TW202'),
  TW204: issueGenerator('TW204', 'Sub-task', 'red', 'TW202'),
  TW205: issueGenerator('TW205', 'Story', 'yellow', 'PM200', 'Initiative'),
  TW206: issueGenerator('TW206', 'Sub-task', 'yellow', 'TW201'),
  TW207: issueGenerator('TW207', 'Sub-task', 'yellow', 'TW205')
};

let fields = {
  'epicLink': [{
            'id': 'customfield_10805',
            'name': 'Epic Link'
          }],
  'noEpicLink': []
};

describe('Story/Sub-task Strategy Apply Tests', () => {
  before(() => {
    dummyClientAPI = {
      findIssue(issueKey) {
        return Promise.resolve(issues[issueKey]);
      },

      listFields() {
        return Promise.resolve(fields.epicLink);
      }
    };

    testStrat = {
      withPass(issueKey) {
        return dummyClientAPI.findIssue(issueKey)
          .then(issue =>
            storyStrat.apply(issue, dummyClientAPI).should.eventually.eql(true)
          );
      },

      withReject(issueKey) {
        return dummyClientAPI.findIssue(issueKey)
          .then(issue =>
            storyStrat.apply(issue, dummyClientAPI).should.eventually.be.rejected
          );
      }
    };
  });

  describe('Okay to commit against', () => {
    it('Sub-task is yellow and all the parents up to the initiative are yellow', () => {
      return testStrat.withPass('TW102');
    });

    it('Story is yellow and all the parents up the initiative are yellow', () => {
      return testStrat.withPass('TW101');
    });

    it('Story is yellow and parent is an initiative which is also yellow', () => {
      return testStrat.withPass('TW103');
    });
  });

  describe('Should not be able to commit against', () => {
    it('Sub-task not yellow', () => {
      return testStrat.withReject('TW204');
    });

    it('Sub-task is yellow, but the story is not', () => {
      return testStrat.withReject('TW203');
    });

    it('Sub-task is yellow, but the epic is not', () => {
      return testStrat.withReject('TW206');
    });

    it('Sub-task is yellow, but the initiative is not', () => {
      return testStrat.withReject('TW207');
    });

    it('Story not yellow', () => {
      return testStrat.withReject('TW202');
    });

    it('Story is yellow, but the epic is not', () => {
      return testStrat.withReject('TW201');
    });

    it('Story is yellow, but the initiative is not', () => {
      return testStrat.withReject('TW205');
    });
  });
});
