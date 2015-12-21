import { findProjectKey, getEpicLinkField, findParent, findIssueLinkParentKey } from '../src/jira-operations.js';
import DummyJira from './dummy-jira.js';

const dummyJira = new DummyJira();

describe('JIRA Operations Tests', () => {
  describe('Find Issue Parent', () => {
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
      dummyJira.listFields = () => {
        return Promise.resolve(dummyJira.fields.noEpicLink);
      };
      dummyJira.host = 'jira.host2.com';

      getEpicLinkField(dummyJira).should.eventually.be.rejected.notify(done);
    });

    it('Find Parent from Sub-task', () => {
      return findParent(dummyJira.issues.SubTask1, dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Story');
        });
    });

    it('Find Parent from Feature Defect', () => {
      return findParent(dummyJira.issues.FeatureDefect1, dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Story');
        });
    });

    it('Find Parent from Story by EpicLink', () => {
      dummyJira.listFields = () => {
        return Promise.resolve(dummyJira.fields.epicLink);
      };
      dummyJira.host = 'jira.host3.com';

      return findParent(dummyJira.issues.Story3, dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Epic');
        });
    });

    it('Find Parent from Story by IssueLink', () => {
      return findParent(dummyJira.issues.Story4, dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Initiative');
        });
    });

    it('Find Parent from Story with no Epic or Initiative', (done) => {
      return findParent(dummyJira.issues.Story9, dummyJira)
        .should.eventually.be.rejectedWith(/Story9 does not have an associated parent Initiative or Epic./)
        .notify(done);
    });

    it('Find Parent from Epic', () => {
      return findParent(dummyJira.issues.Epic3, dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Initiative');
        });
    });

    it('No Parent Found from Epic', done => {
      findParent(dummyJira.issues.Epic1, dummyJira).should.eventually.be.rejected.notify(done);
    });

    it('No Parent Found from Initiative', done => {
      findParent(dummyJira.issues.I2, dummyJira).should.eventually.be.rejected.notify(done);
    });
  });

  describe('Relates Check', () => {
    it('Good Link', () => {
      const result = findIssueLinkParentKey(dummyJira.issues.Story2);
      assert.equal(result, 'I2');
    });

    it('Bad Link', () => {
      const result = findIssueLinkParentKey(dummyJira.issues.Story5);
      assert.equal(result, null);
    });
  });

  describe('Memoization Tests', () => {
    let spy;

    it('findParent with Same Key is Called Only Once', () => {
      spy = sinon.spy(dummyJira, 'findIssue');

      return Promise.all([
        findParent(dummyJira.issues.SubTask2, dummyJira),
        findParent(dummyJira.issues.SubTask2, dummyJira)
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
