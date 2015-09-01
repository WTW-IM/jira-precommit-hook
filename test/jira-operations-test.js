import {findProjectKey, getEpicLinkField, findParent, findIssueLinkParentKey} from '../src/jira-operations.js';
import DummyJira from './dummy-jira.js';

describe('JIRA Operations Tests', function() {
  let dummyJira;

  beforeEach(function() {
    dummyJira = new DummyJira();
  });

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
      return findParent(dummyJira.issues.SubTask1, dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Story');
        });
    });
    it('Find parent from story with Sub-task parent', () => {

      return findParent(dummyJira.issues.LinkedStory1, dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Sub-task');
        });
    });

    it('Find parent from story with Initiative, Epic, and Sub-task parents', () =>
    {

      return findParent(dummyJira.issues.LinkedStory2, dummyJira).then( parent =>{
          parent.fields.issuetype.name.should.eql('Initiative');
      });
    });

    it('Find parent from story with Epic and Sub-task parents', () => {

      return findParent(dummyJira.issues.LinkedStory3, dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Epic');
        });
    });

    it('Find parent\'s parent of a Sub-task that is under a story with a link to a Dispatcher Sub-task', ()=>
      {
        return findParent(dummyJira.issues.LinkedSubtask1, dummyJira)
        .then( subtaskParent =>
            {
                return findParent(subtaskParent, dummyJira).then(storyParent=>
                {
                    storyParent.fields.issuetype.name.should.eql('Sub-task');
                    return findParent(storyParent, dummyJira).then(linkedSubtaskParent=>
                    {
                        linkedSubtaskParent.fields.issuetype.name.should.eql('Dispatcher');
                    });
                });
            }
          );
      });


    it('Find Parent from Feature Defect', () => {
      return findParent(dummyJira.issues.FeatureDefect1, dummyJira)
        .then(parent => {
          parent.fields.issuetype.name.should.eql('Story');
        });
    });

    it('Find Parent from Story by EpicLink', () => {
      dummyJira.listFields = function() {
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
      let result = findIssueLinkParentKey(dummyJira.issues.Story2);
      assert.equal(result, 'I2');
    });

    it('Bad Link', () => {
      let result = findIssueLinkParentKey(dummyJira.issues.Story5);
      assert.equal(result, null);
    });
  });

  describe('Memoization Tests', function() {
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
