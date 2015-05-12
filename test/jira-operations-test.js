import {findParent} from '../src/jira-operations.js';
import {getFilePath, readJSON} from '../src/fs-utils.js';
import path from 'path';

describe('jira-operations tests', function() {
  describe('Find Issue Parent', function() {
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

    it('Find Parent from Sub-task', done => {
      let fieldPath = getFilePath(path.join(__dirname, 'test-issues'), 'TW-9997.json');

      readJSON(fieldPath)
        .then(issue => {
          findParent(issue);
        });



    });

    it('Find Parent from Story by EpicLink');

    it('Find Parent from Story by IssueLink');

    it('Find Parent from Epic');

    it('No parent found');
  });
});
