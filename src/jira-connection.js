import {readJSON, getFilePath} from './fs-utils.js';
import {JiraApi} from 'jira';
import _ from 'lodash';

function promisify(func) {
  return function() {
    let args = Array.prototype.slice.call(arguments);

    return new Promise((fulfill, reject) => {
      args.push((error, resolve) => {
        if(error) {
          reject(error);
          throw new Error(error);
        }
        else {
          fulfill(resolve);
        }
      });

      func.apply(this, args);
    });
  };
}

Object.keys(JiraApi.prototype).forEach(key => {
  let currentProperty = JiraApi.prototype[key];

  if(typeof currentProperty === 'function') {
    JiraApi.prototype[key] = promisify(currentProperty);
  }
});

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
  config = _.defaults(config, defaults);
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
  let apiConfigPromise = getAPIConfig(getFilePath(process.cwd(), '.jirarc'));
  let userConfigPromise = getAuthentication(getFilePath(homePath, '.userconfig'));

  return Promise.all([apiConfigPromise, userConfigPromise])
    .then(([{protocol, host, port, version}, {username, password}]) => {
      return new JiraApi(protocol, host, port, username, password, version);
  });
}
