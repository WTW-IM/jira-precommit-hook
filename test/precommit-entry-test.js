import {getCommitMsg, getIssueReference} from '../src/precommit-entry.js';
import os from 'os';

let newLine = os.EOL;

describe('Precommit-entry Test', () => {
  it('Commit Hook Message', done => {
    let msg = getCommitMsg('test/test.txt');
    msg.should.eventually.eql(`TW-2345${newLine}${newLine}#TW-6346`)
    .notify(done);
  });
});

describe('Issue Number Test', () => {
  it('Parse Issue Number, No Issue Numbers Found', () => {
    getIssueReference('no issue numbers here', 'TW').should.eql([]);
  });

  it('Parse Issue Number', () => {
    getIssueReference('TW-5734', 'TW').should.eql(['TW-5734']);
  });

  it('Parse Multiple Issue Numbers', () => {
    getIssueReference('TW-763 blah TW-856', 'TW').should.eql(['TW-763', 'TW-856']);
  });

  it('Parse Multiple Issue Numbers, Ignore Duplicates', () => {
    getIssueReference('TW-123 blah blah TW-123', 'TW').should.eql(['TW-123']);
  });

  it('Parse Issue Number, Ignore Issue Numbers in Comments', () => {
    return getCommitMsg('test/test.txt')
      .then(content => {
        getIssueReference(content, 'TW').should.eql(['TW-2345']);
      });
  });
});

describe('Story Test', () => {
  it('Story does not exist');
});

describe('Initiative Test', () => {
  it('Find parent initiative');
});
