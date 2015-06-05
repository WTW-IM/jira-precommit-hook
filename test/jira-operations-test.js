import {findProjectKey, getEpicLinkField, findParent, findIssueLinkParentKey} from '../src/jira-operations.js';
import DummyJira from './dummy-jira.js';

let dummyJira = new DummyJira();

describe('JIRA Operations Tests', function() {
  describe('Find Issue Parent', function() {
    it('Find Project Keys', () => {
      return findProjectKey(dummyJira)
              .then(key => {
                key.should.eql('XYZ');
              });
    });

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
      dummyJira.host = 'jira.host2.com';

      getEpicLinkField(dummyJira).should.eventually.be.rejected.notify(done);
    });

    it('Find Parent from Sub-task', () => {
      return findParent(dummyJira.issues['WHP-9995'], dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Story');
        });
    });

    it('Find Parent from Feature Defect', () => {
      return findParent(dummyJira.issues['WHP-9996'], dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Story');
        });
    });

    it('Find Parent from Story by EpicLink', () => {
      dummyJira.listFields = function() {
        return Promise.resolve(dummyJira.fields.epicLink);
      };
      dummyJira.host = 'jira.host3.com';

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

    it('No Parent Found from Epic', done => {
      findParent(dummyJira.issues['WHP-9991'], dummyJira).should.eventually.be.rejected.notify(done);
    });

    it('No Parent Found from Initiative', done => {
      findParent(dummyJira.issues.PM100, dummyJira).should.eventually.be.rejected.notify(done);
    });
  });

  describe('Relates Check', () => {
    it('Good Link', () => {
      let result = findIssueLinkParentKey(dummyJira.issues['WHP-9993']);
      assert.equal(result, 'PM100');
    });

    it('Bad Link', () => {
      let result = findIssueLinkParentKey(dummyJira.issues['WHP-9999']);
      assert.equal(result, null);
    });
  });

  describe('Memoization Tests', function() {
    let spy;

    it('findParent with Same Key is Called Only Once', () => {
      spy = sinon.spy(dummyJira, 'findIssue');

      return Promise.all([
        findParent(dummyJira.issues['WHP-9997'], dummyJira),
        findParent(dummyJira.issues['WHP-9997'], dummyJira)
      ])
      .then(([first, second]) => {
        assert.equal(spy.calledOnce, true);
        assert.equal(first, second);
      });
    });

    it('getEpicLinkField with Same JIRA Host is Called Only Once', () => {
      spy = sinon.spy(dummyJira, 'listFields');
      dummyJira.host = 'jira.host4.com';

      return Promise.all([
        getEpicLinkField(dummyJira),
        getEpicLinkField(dummyJira)
      ])
      .then(([first, second]) => {
        assert.equal(spy.calledOnce, true);
        assert.equal(first, second);
      });
    });
  });
});
