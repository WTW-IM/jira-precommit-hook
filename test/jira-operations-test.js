import {findParent} from '../src/jira-operations.js';
import {getFilePath, readJSON} from '../src/fs-utils.js';
import path from 'path';
import createTestIssue from './issue-generator.js';

let issues = {
  'WHP-9994': createTestIssue('WHP-9994', 'Sub-task', 'yellow', 'WHP-9993', 'Story'),
  'WHP-9993': createTestIssue('WHP-9993', 'Story', 'yellow', 'WHP-9991', 'Epic'),
  'WHP-9992': createTestIssue('WHP-9992', 'Story', 'yellow', 'WHP-9990', 'Initiative'),
  'WHP-9991': createTestIssue('WHP-9991', 'Epic', 'yellow', 'WHP-9990', 'Initiative'),
  'WHP-9990': createTestIssue('WHP-9990', 'Initiative', 'yellow')
};

describe('jira-operations tests', function() {
  describe('Find Issue Parent', function() {

    let dummyJira = null;

    before(() => {
      dummyJira = {
        findIssue(key) {
          return Promise.resolve(issues[key]);
        },

        listFields() {
          return readJSON(getFilePath(path.join(__dirname, 'test-issues'), 'field.json'));
        }
      };
    });

    it('Find Epic Link', done => {
      let fieldPath = getFilePath(path.join(__dirname, 'test-issues'), 'Field.json');

      readJSON(fieldPath)
        .then(issue => {
          for(let i = 0; i < issue.length; i++) {
            if(issue[i].name === 'Epic Link') {
              return issue[i].id;
            }
          }
        })
        .then(id => {
          id.should.equal('customfield_10805');
          done();
        });
    });

    it('Find Parent from Sub-task', () => {
      return findParent(issues['WHP-9994'], dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Story');
        });
    });

    it('Find Parent from Story by EpicLink', () => {
      return findParent(issues['WHP-9993'], dummyJira)
        .then(parent => {
          console.log(parent);
          parent.fields.issuetype.name.should.eql('Epic');
        });
    });

    it('Find Parent from Story by IssueLink', () => {
      return findParent(issues['WHP-9992'], dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Initiative');
        });
    });

    it('Find Parent from Epic', () => {
      return findParent(issues['WHP-9991'], dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Initiative');
        });
    });

    it('No parent found', () => {
      let fn = function() { findParent(issues['WHP-9990'], dummyJira); };
      expect(fn).to.throw(Error);
    });
  });
});
