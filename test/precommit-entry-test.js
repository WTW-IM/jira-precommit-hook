import * as pce from '../src/precommit-entry';
import sinon from 'sinon';
import sPromise from 'sinon-as-promised';
import * as issueHandler from '../src/issue-handler';
import fsp from 'fs-promise';
import os from 'os';

let eol = os.EOL;

describe('precommit-entry tests', () => {
  describe('Hook Message', () => {
    beforeEach(() => {
      sinon.stub(issueHandler, 'issueStrategizer', issues => {
        let jsonObjects = [
          {
            'issueType': {
              'name': 'Story'
            }
          },
          {
            'issueType': {
              'name': 'Story'
            }
          },
          {
            'issueType': {
              'name': 'Story'
            }
          }
        ];
        return jsonObjects;
      });

      let readFileStub = sinon.stub(fsp, 'readFile');
      readFileStub.resolves('TW-5032' + eol + 'TW-2380' + eol + 'TW-2018');
    });

    afterEach(() => {
      issueHandler.issueStrategizer.restore();
      fsp.readFile.restore();
    });

    it('read from issue list and return JSON array', () => {
      return pce.getCommitMsg('issuesTestFile.txt')
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
