import { findProjectKey, getEpicLinkField, findParent, findIssueLinkParentKey }
  from '../src/jira-operations.js';
import DummyJira from './dummy-jira.js';

const dummyJira = new DummyJira();

describe('JIRA Operations Tests', () => {
  describe('Find Issue Parent', () => {
    it('Find Project Keys', () => {
      findProjectKey(dummyJira)
        .then(key => {
          key.should.eql('XYZ');
        });
    });

    it('Find Epic Link', () => {
      getEpicLinkField(dummyJira)
        .then(field => {
          field.should.eql('customfield_10805');
        });
    });

    it('Missing Epic Link', done => {
      dummyJira.listFields = async function() {
        return dummyJira.fields.noEpicLink;
      };
      dummyJira.host = 'jira.host2.com';

      getEpicLinkField(dummyJira)
        .should.eventually.be.rejectedWith(/Cannot find Epic Link Field/)
        .notify(done);
    });

    it('Find Parent from Sub-task', async function() {
      const parent = await findParent(dummyJira.issues.SubTask1, dummyJira);
      parent.fields.issuetype.name.should.eql('Story');
    });

    it('Find Parent from Feature Defect', async function() {
      const parent = await findParent(dummyJira.issues.FeatureDefect1, dummyJira);
      parent.fields.issuetype.name.should.eql('Story');
    });

    it('Find Parent from Story by EpicLink', async function() {
      dummyJira.listFields = async function() {
        return dummyJira.fields.epicLink;
      };
      dummyJira.host = 'jira.host3.com';

      const parent = await findParent(dummyJira.issues.Story3, dummyJira);
      parent.fields.issuetype.name.should.eql('Epic');
    });

    it('Find Parent from Story by IssueLink', async function() {
      const parent = await findParent(dummyJira.issues.Story4, dummyJira);
      parent.fields.issuetype.name.should.eql('Initiative');
    });

    it('Find Parent from Story with no Epic or Initiative', (done) => {
      findParent(dummyJira.issues.Story9, dummyJira)
        .should.eventually.be.rejectedWith(
          /Story9 does not have an associated parent Initiative or Epic./)
        .notify(done);
    });

    it('Find Parent from Epic', async function() {
      const parent = await findParent(dummyJira.issues.Epic3, dummyJira);
      parent.fields.issuetype.name.should.eql('Initiative');
    });

    it('No Parent Found from Epic', done => {
      findParent(dummyJira.issues.Epic1, dummyJira)
        .should.eventually.be.rejectedWith(
          /initiative from Epic Epic1 in issue links. Initiative should be linked by 'relates to'/)
        .notify(done);
    });

    it('No Parent Found from Initiative', done => {
      findParent(dummyJira.issues.I2, dummyJira)
        .should.eventually.be.rejectedWith(/Initiative should not have a parent/)
        .notify(done);
    });
  });

  describe('Relates Check', () => {
    it('Good Link', () => {
      const result = findIssueLinkParentKey(dummyJira.issues.Story2);
      result.should.equal('I2');
    });

    it('Bad Link', () => {
      const result = findIssueLinkParentKey(dummyJira.issues.Story5);
      expect(result).to.be.null;
    });
  });

  describe('Memoization Tests', () => {
    let spy;

    it('findParent with Same Key is Called Only Once', async function() {
      spy = sinon.spy(dummyJira, 'findIssue');

      const [first, second] = await Promise.all([
        findParent(dummyJira.issues.SubTask2, dummyJira),
        findParent(dummyJira.issues.SubTask2, dummyJira)
      ]);

      spy.calledOnce.should.be.true;
      first.should.equal(second);
    });

    it('getEpicLinkField with Same JIRA Host is Called Only Once', async function() {
      spy = sinon.spy(dummyJira, 'listFields');
      dummyJira.host = 'jira.host4.com';

      const [first, second] = await Promise.all([
        getEpicLinkField(dummyJira),
        getEpicLinkField(dummyJira)
      ]);

      spy.calledOnce.should.be.true;
      first.should.equal(second);
    });
  });
});
