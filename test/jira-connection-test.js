import {getAPIConfig, getAuthentication, validateAPIConfig, validateAuthentication} from '../src/jira-connection.js';
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
let badAuthenticationObject = {
  'password': 'SuperSecret'
};

describe('jira-connection tests', function() {
  describe('APIConfig', function() {
    it('Get project URL', function(){
      return getAPIConfig(jiraPath)
        .then(config => config.projectName.should.equal('test'));
    });

    it('Get host', function(){
      return getAPIConfig(jiraPath)
        .then(config => config.host.should.equal('jira.com'));
    });

    it('Validation', function(){
      let object = validateAPIConfig(goodJiraObject);
      object.projectName.should.equal('test');
    });

    it('Bad API Config', function(){
      assert.throw( () => { validateAPIConfig(badJiraObject); }, '.jirarc missing host url. Please check the README for details');
    });
  });

  describe('Authentication', function(){
    it('Get username', function(){
      return getAuthentication(authPath)
        .then(authConfig => authConfig.username.should.equal('UserDudeBro'));
    });

    it('Get password', function(){
      return getAuthentication(authPath)
        .then(authConfig => authConfig.password.should.equal('SuperSecret'));
    });

    it('Validation', function(){
      let object = validateAuthentication(goodAuthenticationObject);
      object.username.should.equal('UserDudeBro');
    });

    it('Bad auth Config', function(){
      assert.throw( () => {validateAuthentication(badAuthenticationObject); }, '.userconfig missing username');
    });
  });
});
