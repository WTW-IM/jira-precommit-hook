import * as pce from '../src/precommit-entry';
import sinon from 'sinon';
import fsp from 'fs-promise';
import issueHandler from '../src/issue-handler';

describe('precommit-entry tests', () => {
  describe('Hook Message', () => {
    it('Commit hook msg', done => {
      let stub = sinon.stub(pce, 'getCommitMsg', path => {
        fsp.readFile(path, {encoding:'utf8'})
          .then(contents => pce.getIssueReference(contents, 'TW'))
          // what do I do with the issues?s
          .then(issues => console.log('Issues:\n' + issues))
          .catch(err => console.error(err));
      });
      stub('test/issuesTestFile.txt');
      done();
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
      return pce.getCommitMsg('test/test.txt')
      .then(content => {
        pce.getIssueReference(content, 'TW').should.eql(['TW-2345']);
      });
    });
  });
});
