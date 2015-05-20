import {getJiraAPI} from '../src/jira-connection.js';
import path from 'path';

describe('JIRA Connection Tests', function() {
  it('JIRA Object has Correct Project Name', () => {
    return getJiraAPI(path.join(process.cwd(), 'test'))
      .then(testJira => {
        testJira.projectName.should.eql('test');
      });
  });
});
