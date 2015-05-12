import {getAPIConfig, getAuthentication, validateAPIConfig, validateAuthentication, findParent} from '../src/jira-handler.js';
import {getFilePath, readJSON} from '../src/fs-utils.js';
import path from 'path';

let jiraPath = getFilePath(path.join(process.cwd(), 'test'), '.jirarc');
let authPath = getFilePath(path.join(process.cwd(), 'test'), '.userconfig');

let goodJiraObject = {
  'projectName': 'test',
  'protocol':'https',
  'host':'jira.com',
  'port': 8080,
  'version': '2.1.0',
  'verbose': true,
  'strictSSL': true
};

let badJiraObject = {
	'projectName': 'test',
	'port': 8080,
	'version': '2.1.0',
	'verbose': true,
	'strictSSL': true
};

let goodAuthenticationObject = {
  'username': 'UserDudeBro',
  'password': 'SuperSecret'
};
let missingUsername = {
  'password': 'SuperSecret'
};
let missingPassword = {
  'username' : 'UserDudeBro'
};

describe('jira-handler tests', function(){
	describe('APIConfig', function() {
		it('Get project URL', function(){
			return getAPIConfig(jiraPath)
				.then(config => config.projectName.should.equal('test'));
		});





    it('Get host', () => {
      return getAPIConfig(jiraPath)
        .then(config => config.host.should.equal('jira.com'));
    });

    it('Validation', () => {
      let object = validateAPIConfig(goodJiraObject);
      object.projectName.should.equal('test');
    });

    it('Missing host', () => {
      assert.throw( () => { validateAPIConfig(missingHost); }, '.jirarc missing host url. Please check the README for details');
    });

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

    it('Parent not found', done => {
      let fieldPath = getFilePath(path.join(__dirname, 'test-issues'), 'TW-9997.json');

      readJSON(fieldPath)
        .then(issue => {
          findParent(issue);
        });
    });

    it('Find Initiative from Sub-task');

    it('Find Initiative from Story');

    it('Initiative not found');
  });
});
