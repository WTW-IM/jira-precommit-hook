import {readJSON, getFilePath} from './fs-utils.js';
import {JiraApi} from 'jira';
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

//Grabs data from files and returns a JIRA connection object wrapped in promise
export function getJiraAPI() {
	let homePath = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME;

  return Promise.all([getAPIConfig(getFilePath(process.cwd(), '.jirarc')),
    getAuthentication(getFilePath(homePath, '.userconfig'))])
  .then(values => {
    return new JiraApi(values[0].protocol, values[0].host, values[0].port,
      values[1].username, values[1].password, values[0].version);
  });
}

//Sends a request to get JIRA Issue and returns JSON wrapped in promise
export function getJiraIssue(jiraObject, issueNumber) {
	return new Promise((fulfill, reject) => {
		jiraObject.findIssue(issueNumber, (error, resolve) => {
			if(error) {
				console.log('REJECT ' + error);
				reject(error);
			}
			else {
				fulfill(resolve);
			}
		});
	});
}


getJiraAPI()
  .then(jira => getJiraIssue(jira, 'tw-1675'))
  .then(issue => console.log(issue.id))
  .catch(error => console.log(error));
