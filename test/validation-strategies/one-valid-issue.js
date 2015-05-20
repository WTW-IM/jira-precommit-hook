import * as validStrat from '../../src/validation-strategies/one-valid-issue.js';
import issueGenerator from '../issue-generator.js';

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

let dummyClientAPI = null;

describe('One valid issue apply tests', () => {
  before(() => {
    dummyClientAPI = {
      findIssue(issueKey) {
        if(issues[issueKey] === undefined) {
          return Promise.reject(new Error(`Issue ${issueKey} does not exist.`));
        }
        return Promise.resolve(issues[issueKey]);
      },

      listFields() {
        return Promise.resolve(fields.epicLink);
      }
    };
  });

  it('1 good issue', () => {
    let testIssues = ['TW101'];
    validStrat.apply(testIssues, dummyClientAPI).should.eventually.equal(true);
  });

  it('1 bad issue', () => {
    let testIssues = ['TW201'];
    validStrat.apply(testIssues, dummyClientAPI).should.eventually.be.rejectedWith(Error);
  });

  it('1 good issue, 1 bad issue', () => {
    let testIssues = ['TW101', 'TW201'];
    validStrat.apply(testIssues, dummyClientAPI).should.eventually.equal(true);
  });

  it('2 bad issues', () => {
    let testIssues = ['TW201', 'TW206'];
    validStrat.apply(testIssues, dummyClientAPI).should.eventually.be.rejectedWith(Error);
  });
});
