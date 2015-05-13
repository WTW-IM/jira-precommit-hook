import {findParent, getEpicLinkField} from '../src/jira-operations.js';
import createTestIssue from './issue-generator.js';

let issues = {
  'WHP-9994': createTestIssue('WHP-9994', 'Sub-task', 'yellow', 'WHP-9993', 'Story'),
  'WHP-9993': createTestIssue('WHP-9993', 'Story', 'yellow', 'WHP-9991', 'Epic'),
  'WHP-9992': createTestIssue('WHP-9992', 'Story', 'yellow', 'WHP-9990', 'Initiative'),
  'WHP-9991': createTestIssue('WHP-9991', 'Epic', 'yellow', 'WHP-9990', 'Initiative'),
  'WHP-9990': createTestIssue('WHP-9990', 'Initiative', 'yellow')
};

let fields = {
  'epicLink': [{
            'id': 'customfield_10805',
            'name': 'Epic Link'
          }],
  'noEpicLink': []
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
          return Promise.resolve(fields.epicLink);
        }
      };
    });

    it('Find Epic Link', () => {
      return getEpicLinkField(dummyJira)
        .then(field => {
          field.should.eql('customfield_10805');
        });
    });

    it('Missing Epic Link', done => {
      dummyJira.listFields = function() {
        return Promise.resolve(fields.noEpicLink);
      };

        getEpicLinkField(dummyJira).should.eventually.be.rejected.notify(done);
    });

    it('Find Parent from Sub-task', () => {
      return findParent(issues['WHP-9994'], dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Story');
        });
    });

    it('Find Parent from Story by EpicLink', () => {
      dummyJira.listFields = function() {
        return Promise.resolve(fields.epicLink);
      };

      return findParent(issues['WHP-9993'], dummyJira)
        .then(parent => {
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

    it('No parent found', done => {
      findParent(issues['WHP-9990'], dummyJira).should.eventually.be.rejected.notify(done);
    });
  });
});
