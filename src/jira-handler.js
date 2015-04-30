import {readJSON, getFilePath} from './fs-utils.js';
import {JiraApi} from 'jira';
import fs from 'fs';
import lodash from 'lodash';

export function validateAPIConfig(config){
  // validate that this is a proper .jirarc file
  if(!config.host) {
    throw new Error('.jirarc missing host url. Please check the README for details');
  }
  if(!config.projectName) {
    throw new Error('.jirarc missing project name. Please check the README for details');
  }
  let defaults = {
    protocol: 'http',
    port: 80,
    version: '2.0.0',
    verbose: false,
    strictSSL: true
  };
  config = lodash.defaults(config, defaults);
  return config;
}

export function validateAuthentication(authConfig){
  // validate that there are proper credentials
  if(!authConfig.username) {
    throw new Error('.userconfig missing username');
  }
  if(!authConfig.password) {
    throw new Error('.userconfig missing password');
  }
  return authConfig;
}

export function getAPIConfig(filePath){
  return readJSON(filePath)
    .then(config => validateAPIConfig(config));
}

export function getAuthentication(filePath) {
  return readJSON(filePath)
      .then(config => validateAuthentication(config));
}

export function getAuthentication(filePath) {
  if(!fs.existsSync(filePath)) {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    // create file with credentials provided by user
    console.log('.userconfig does not exist, creating file');
    console.log('What is your JIRA username?');
    let username = 'x'; // read from user
    console.log('What is your JIRA password?');
    let password = 'x';

    if(username && password) {
      let fileString = username + '\n' + password;
      fs.writeFile(filePath, fileString);
    } else {
      throw new Error('Username and/or password is invalid');
    }
  }
  return readJSON(filePath)
      .then(config => validateAuthentication(config));
}

export function getJiraAPI() {
	let homePath = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME;
	let APIConfig;
	let userConfig;

	return getAPIConfig(getFilePath(process.cwd(), '.jirarc'))
	.then(config => APIConfig = config)
	.then(() => getAuthentication(getFilePath(homePath, '.userconfig')))
	.then(config => userConfig = config)
	.then(() => new JiraApi(APIConfig.protocol, APIConfig.host, APIConfig.port,
			userConfig.username, userConfig.password, APIConfig.version)
	);
}

export function getJiraIssue(jiraObject, issueNumber) {
	return new Promise((fulfill, reject) => {
		jiraObject.findIssue(issueNumber, (error, resolve) => {
			if(error) {
				console.log('REJECT: ' + error);
				reject(error);
			}
			else {
				fulfill(resolve);
			}
		});
	});
}
