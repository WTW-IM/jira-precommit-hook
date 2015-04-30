import {getAPIConfig, getAuthentication, validateAPIConfig, validateAuthentication} from '../src/jira-handler.js';
import {getFilePath} from '../src/fs-utils.js';
import path from 'path';
import fs from 'fs';

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

	describe('JiraAPI', () => {
		before(() => {});

		it('Valid Jira API Object');

		it('Invalid Jira API Object');

		it('Correct Issue ID');

		it('Incorrect Issues ID');

		it('Issue has parent');

		it('Issue does not have a parent');
	});
});
