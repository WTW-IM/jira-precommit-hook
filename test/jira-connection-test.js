import {getJiraAPI} from '../src/jira-connection.js';
import path from 'path';
import DummyJira from './dummy-jira.js';

describe('JIRA Connection Tests', () => {
  it('JIRA Object has Correct Project Name', () => {
    return getJiraAPI(path.join(process.cwd(), 'test', '.jirarc'))
      .then(testJira => {
        testJira.projectName.should.eql('test');
      });
  });

  describe('findIssue Memoization', () => {
    let jiraApi;
    let spy;

    const dummyJira = new DummyJira();

    beforeEach(() => {
      return getJiraAPI(path.join(process.cwd(), 'test', '.jirarc'))
        .then(testJira => {
          jiraApi = testJira;

          jiraApi.request = sinon.stub(jiraApi, 'request', (options, callback) => {
            const issueNumber = options.uri.split('/').pop().toString();
            callback('', {statusCode: 200}, JSON.stringify(dummyJira.issues[issueNumber]));
          });

          spy = sinon.spy(jiraApi, 'doRequest');
        });
    });

    it('findIssue with Same Key is Run Only Once', () => {
      return Promise.all([
        jiraApi.findIssue('Story5'),
        jiraApi.findIssue('Story5')
      ])
      .then(([first, second]) => {
        assert.equal(spy.calledOnce, true);
        assert.equal(first, second);
      });
    });

    it('findIssue with Different Keys is Run Twice', () => {
      return Promise.all([
        jiraApi.findIssue('Story1'),
        jiraApi.findIssue('Story2')
      ])
      .then(([first, second]) =>{
        assert.equal(first.key, 'Story1');
        assert.equal(second.key, 'Story2');
        assert.equal(spy.calledTwice, true);
      });
    });
  });
});
