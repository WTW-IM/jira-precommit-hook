import {getFilePath} from './fs-utils.js';
import {getAPIConfig, getAuthentication} from './jira-configuration.js';
import {JiraApi} from 'jira';

function promisify(func) {
  return function(...args) {
    return new Promise((fulfill, reject) => {
      args.push((error, result) => {
        if(error) {
          reject(error);
          throw new Error(error);
        }
        else {
          fulfill(result);
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

//Grabs data from files and returns a JIRA connection object wrapped in promise
export function getJiraAPI() {
  let homePath = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
  let apiConfigPromise = getAPIConfig(getFilePath(process.cwd(), '.jirarc'));
  let userConfigPromise = getAuthentication(getFilePath(homePath, '.userconfig'));

  return Promise.all([apiConfigPromise, userConfigPromise])
    .then(([{protocol, host, port, version}, {username, password}]) => {
      return new JiraApi(protocol, host, port, username, password, version);
  });
}
