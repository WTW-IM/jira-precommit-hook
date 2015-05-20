import {findProjectKey, getEpicLinkField, findParent} from '../src/jira-operations.js';
import DummyJira from './dummy-jira.js';

let dummyJira = new DummyJira();

describe('jira-operations tests', function() {
  it('Find Project Keys', () => {
    return findProjectKey(dummyJira)
            .then(key => {
              key.should.eql('XYZ');
            });
  });

  describe('Find Issue Parent', function() {
    it('Find Epic Link', () => {
      return getEpicLinkField(dummyJira)
        .then(field => {
          field.should.eql('customfield_10805');
        });
    });

    it('Missing Epic Link', done => {
      dummyJira.listFields = function() {
        return Promise.resolve(dummyJira.fields.noEpicLink);
      };

        getEpicLinkField(dummyJira).should.eventually.be.rejected.notify(done);
    });

    it('Find Parent from Sub-task', () => {
      return findParent(dummyJira.issues['WHP-9995'], dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Story');
        });
    });

    it('Find Parent from Story by EpicLink', () => {
      dummyJira.listFields = function() {
        return Promise.resolve(dummyJira.fields.epicLink);
      };

      return findParent(dummyJira.issues['WHP-9994'], dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Epic');
        });
    });

    it('Find Parent from Story by IssueLink', () => {
      return findParent(dummyJira.issues['WHP-9993'], dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Initiative');
        });
    });

    it('Find Parent from Epic', () => {
      return findParent(dummyJira.issues['WHP-9992'], dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Initiative');
        });
    });

    it('No parent found from Epic', done => {
      findParent(dummyJira.issues['WHP-9991'], dummyJira).should.eventually.be.rejected.notify(done);
    });

    it('No parent found from Initiative', done => {
      findParent(dummyJira.issues['WHP-9990'], dummyJira).should.eventually.be.rejected.notify(done);
    });
  });
});
