import {getAPIConfig, getAuthentication, validateAPIConfig, validateAuthentication} from '../src/jira-configuration.js';
import {getFilePath} from '../src/fs-utils.js';
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
let missingHost = {
  'projectName': 'test',
  'port': 8080,
  'version': '2.1.0',
  'verbose': true,
  'strictSSL': true
};
let missingProjectName = {
  'host': 'jira.com'
};
let incompleteJiraObject = {
  'projectName': 'test',
  'host': 'jira.com'
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

describe('JIRA Configuration Tests', () => {
  describe('API Config', () => {
    it('Get Project URL', () => {
      return getAPIConfig(jiraPath)
        .then(config => config.projectName.should.equal('test'));
    });

    it('Get Host', () => {
      return getAPIConfig(jiraPath)
        .then(config => config.host.should.equal('jira.com'));
    });

    it('Validation', () => {
      let object = validateAPIConfig(goodJiraObject);
      object.projectName.should.equal('test');
    });

    it('Missing Host', () => {
      assert.throw( () => { validateAPIConfig(missingHost); }, '.jirarc missing host url. Please check the README for details');
    });

    it('Missing Project Name', () => {
      assert.throw( () => { validateAPIConfig(missingProjectName); }, '.jirarc missing project name. Please check the README for details');
    });
  });

  describe('Incomplete JIRA Object Tests', () => {
    it('Comparing to Default Values', () => {
      let object = validateAPIConfig(incompleteJiraObject);
      object.protocol.should.equal('http');
      object.port.should.equal(80);
      object.version.should.equal('2.0.0');
      object.verbose.should.equal(false);
      object.strictSSL.should.equal(true);
    });
  });

  describe('Authentication', () => {
    it('Get username', () => {
      return getAuthentication(authPath)
        .then(authConfig => authConfig.username.should.equal('UserDudeBro'));
    });

    it('Get Password', () => {
      return getAuthentication(authPath)
        .then(authConfig => authConfig.password.should.equal('SuperSecret'));
    });

    it('Validation', () => {
      let object = validateAuthentication(goodAuthenticationObject);
      object.username.should.equal('UserDudeBro');
    });

    it('Missing Username', () => {
      assert.throw( () => { validateAuthentication(missingUsername); }, '.userconfig missing username');
    });

    it('Missing Password', () => {
      assert.throw( () => { validateAuthentication(missingPassword); }, '.userconfig missing password');
    });
  });
});
