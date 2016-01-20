import { getJiraAPI } from '../src/jira-connection.js';
import path from 'path';
import DummyJira from './dummy-jira.js';

describe('JIRA Connection Tests', () => {
  it('JIRA Object has Correct Project Name', async () => {
    const testJira = await getJiraAPI(path.join(process.cwd(), 'test', '.jirarc'));
    testJira.projectName.should.eql('test');
  });

  describe('findIssue Memoization', () => {
    let jiraApi;
    let spy;

    const dummyJira = new DummyJira();

    beforeEach(async () => {
      const testJira = await getJiraAPI(path.join(process.cwd(), 'test', '.jirarc'));
      jiraApi = testJira;

      spy = sinon.stub(jiraApi, 'doRequest', async function(options) {
        const issueNumber = options.uri.split('/').pop().toString();
        return dummyJira.issues[issueNumber];
      });
    });

    it('findIssue with Same Key is Run Only Once', async () => {
      const [first, second] = await Promise.all([
        jiraApi.findIssue('Story5'),
        jiraApi.findIssue('Story5')
      ]);

      assert.equal(spy.calledOnce, true);
      assert.equal(first, second);
    });

    it('findIssue with Different Keys is Run Twice', async () => {
      const [first, second] = await Promise.all([
        jiraApi.findIssue('Story1'),
        jiraApi.findIssue('Story2')
      ]);

      assert.equal(first.key, 'Story1');
      assert.equal(second.key, 'Story2');
      assert.equal(spy.calledTwice, true);
    });
  });
});
