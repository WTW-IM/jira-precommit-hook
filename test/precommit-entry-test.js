import * as pce from '../src/precommit-entry';
import * as issueHandler from '../src/issue-handler';
import opsys from 'os';
import * as connection from '../src/jira-connection';
import * as operations from '../src/jira-operations';
import JiraApi from 'jira-client';
import * as fileUtils from '../src/fs-utils';

const eol = opsys.EOL;

describe('precommit-entry tests', () => {
  describe('Hook Message', () => {
    beforeEach(() => {
      const stubJson = {
        issueType: {
          name: 'Story'
        }
      };

      sinon.stub(issueHandler, 'issueStrategizer', issues => {
        const jsonObjects = [stubJson, stubJson, stubJson];
        return jsonObjects;
      });

      sinon.stub(connection, 'getJiraAPI', () => {
        const api = new JiraApi(
          'http',
          'www.jira.com',
          80,
          'UserDudeBro',
          'SuperSecret',
          '2.0.0'
        );
        return Promise.resolve(api);
      });

      operations.findProjectKey = (api) => 'TW';

      sinon.stub(fileUtils, 'findParentFolder', (startDir, fileName) => './.jirarc');
    });

    afterEach(() => {
      issueHandler.issueStrategizer.restore();
      connection.getJiraAPI.restore();
      fileUtils.findParentFolder.restore();
    });

    it('read from issue list and return JSON array', () => {
      pce.getCommitMsg(Promise.resolve(''))
        .then(results => {
          results.length.should.equal(3);
        });
    });

    it('Check for merge commit', () => {
      pce.getCommitMsg(Promise.resolve('Merge'))
        .then(results => {
          assert.equal(results, null);
        });
    });

    it('Check for revert commit', () => {
      pce.getCommitMsg(Promise.resolve('Revert'))
        .then(results => {
          results.length.should.equal(3);
        });
    });
  });

  describe('Issue number test', () => {
    it('Parse issue number, no issue numbers found', () => {
      pce.getIssueReference('no issue numbers here', 'TW').should.eql([]);
    });

    it('Parse issue number', () => {
      pce.getIssueReference('TW-5734', 'TW').should.eql(['TW-5734']);
    });

    it('Parse issue number lowercase', () => {
      pce.getIssueReference('tw-5734', 'TW').should.eql(['TW-5734']);
    });

    it('Parse issue number mixed case', () => {
      pce.getIssueReference('tW-5734', 'TW').should.eql(['TW-5734']);
    });

    it('Parse multiple issue numbers', () => {
      pce.getIssueReference('TW-763 blah TW-856', 'TW').should.eql(['TW-763', 'TW-856']);
    });

    it('Parse multiple issue numbers, ignore duplicates', () => {
      pce.getIssueReference('TW-123 blah blah TW-123', 'TW').should.eql(['TW-123']);
    });

    it('Parse issue number, ignore issue numbers in comments', () => {
      const content = `TW-2345${eol}#TW-6346`;
      pce.getIssueReference(content, 'TW').should.eql(['TW-2345']);
    });
  });
});
