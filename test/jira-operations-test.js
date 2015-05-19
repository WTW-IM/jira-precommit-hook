import {findProjectKey, getEpicLinkField, findParent} from '../src/jira-operations.js';
import createTestIssue from './issue-generator.js';

let issues = {
  'WHP-9995': createTestIssue('WHP-9995', 'Sub-task', 'yellow', 'WHP-9994', 'Story'),
  'WHP-9994': createTestIssue('WHP-9994', 'Story', 'yellow', 'WHP-9992', 'Epic'),
  'WHP-9993': createTestIssue('WHP-9993', 'Story', 'yellow', 'WHP-9990', 'Initiative'),
  'WHP-9992': createTestIssue('WHP-9992', 'Epic', 'yellow', 'WHP-9990', 'Initiative'),
  'WHP-9991': createTestIssue('WHP-9991', 'Epic', 'yellow'),
  'WHP-9990': createTestIssue('WHP-9990', 'Initiative', 'yellow')
};

let fields = {
  'epicLink': [{
            'id': 'customfield_10805',
            'name': 'Epic Link'
          }],
  'noEpicLink': []
};

let projects = [
  {
    'key': 'ABC',
    'name': 'First Three'
  },
  {
    'key': 'XYZ',
    'name': 'Last Three'
  }
];

let dummyJira = null;

describe('jira-operations tests', function() {
    before(() => {
      dummyJira = {
        projectName: 'Last Three',
        listProjects() {
          return Promise.resolve(projects);
        }
      };
    });

  it('Find Project Keys', () => {
    return findProjectKey(dummyJira)
            .then(key => {
              key.should.eql('XYZ');
            });
  });

  describe('Find Issue Parent', function() {

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
      return findParent(issues['WHP-9995'], dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Story');
        });
    });

    it('Find Parent from Story by EpicLink', () => {
      dummyJira.listFields = function() {
        return Promise.resolve(fields.epicLink);
      };

      return findParent(issues['WHP-9994'], dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Epic');
        });
    });

    it('Find Parent from Story by IssueLink', () => {
      return findParent(issues['WHP-9993'], dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Initiative');
        });
    });

    it('Find Parent from Epic', () => {
      return findParent(issues['WHP-9992'], dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Initiative');
        });
    });

    it('No parent found from Epic', done => {
      findParent(issues['WHP-9991'], dummyJira).should.eventually.be.rejected.notify(done);
    });

    it('No parent found from Initiative', done => {
      findParent(issues['WHP-9990'], dummyJira).should.eventually.be.rejected.notify(done);
    });
  });
});
