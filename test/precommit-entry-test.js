import {getCommitMsg, getIssueReference} from '../src/precommit-entry.js';
import os from 'os';

let newLine = os.EOL;

describe('precommit-entry tests', () => {
  describe('Hook Message', () => {
    it('Commit hook msg', done => {
      let msg = getCommitMsg('test/test.txt');
      msg.should.eventually.eql(`TW-2345${newLine}${newLine}#TW-6346`)
      .notify(done);
    });
  });

  describe('Issue number test', () => {
    it('Parse issue number, no issue numbers found', () => {
      getIssueReference('no issue numbers here', 'TW').should.eql([]);
    });

    it('Parse issue number', () => {
      getIssueReference('TW-5734', 'TW').should.eql(['TW-5734']);
    });

    it('Parse multiple issue numbers', () => {
      getIssueReference('TW-763 blah TW-856', 'TW').should.eql(['TW-763', 'TW-856']);
    });

    it('Parse multiple issue numbers, ignore duplicates', () => {
      getIssueReference('TW-123 blah blah TW-123', 'TW').should.eql(['TW-123', 'TW-856']);
    });

    it('Parse issue number, ignore issue numbers in comments', () => {
      return getCommitMsg('test/test.txt')
        .then(content => {
          getIssueReference(content, 'TW').should.eql(['TW-2345']);
        });
    });
  });
});
