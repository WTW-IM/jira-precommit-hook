import * as pce from '../src/precommit-entry';
import * as issueHandler from '../src/issue-handler';
import os from 'os';
import * as connection from '../src/jira-connection';
import * as operations from '../src/jira-operations';
import {JiraApi} from 'jira';
import * as fileUtils from '../src/fs-utils';

let eol = os.EOL;

describe('precommit-entry tests', () => {
  describe('Hook Message', () => {
    beforeEach(() => {
      let stubJson = {
        'issueType': {
          'name': 'Story'
        }
      };

      sinon.stub(issueHandler, 'issueStrategizer', issues => {
        let jsonObjects = [stubJson, stubJson, stubJson];
        return jsonObjects;
      });

      sinon.stub(connection, 'getJiraAPI', () => {
        return Promise.resolve(new JiraApi('http', 'www.jira.com', 80, 'UserDudeBro', 'SuperSecret', '2.0.0'));
      });

      operations.findProjectKey = function(api) {
        return 'TW';
      };

      sinon.stub(fileUtils, 'findParentFolder', (startDir, fileName) => {
        return './.jirarc';
      });
    });

    afterEach(() => {
      issueHandler.issueStrategizer.restore();
      connection.getJiraAPI.restore();
      fileUtils.findParentFolder.restore();
    });

    it('read from issue list and return JSON array', () => {
      return pce.getCommitMsg(Promise.resolve(''))
        .then(results => {
          results.length.should.equal(3);
        });
    });

    it('Check for merge commit', () => {
      return pce.getCommitMsg(Promise.resolve('Merge'))
        .then(results => {
          assert.equal(results, null);
        });
    });

    it('Check for revert commit', () => {
      return pce.getCommitMsg(Promise.resolve('Revert'))
        .then(results => {
          assert.equal(results, null);
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

    it('Parse multiple issue numbers', () => {
      pce.getIssueReference('TW-763 blah TW-856', 'TW').should.eql(['TW-763', 'TW-856']);
    });

    it('Parse multiple issue numbers, ignore duplicates', () => {
      pce.getIssueReference('TW-123 blah blah TW-123', 'TW').should.eql(['TW-123']);
    });

    it('Parse issue number, ignore issue numbers in comments', () => {
      let content = 'TW-2345' + eol + '#TW-6346';
      pce.getIssueReference(content, 'TW').should.eql(['TW-2345']);
    });
  });
});
