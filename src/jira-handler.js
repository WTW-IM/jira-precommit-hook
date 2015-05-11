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

export function getEpicLinkField(jiraClient) {
  return jiraClient.listFields()
    .then(fields => {
      for(let i = 0; i < fields.length; i++) {
        if(fields[i].name === 'Epic Link') {
          return fields[i].id;
        }
      }

      throw new Error('Cannot find Epic Link Field.');
    });
}

export function findParent(issue, jiraClient) {
  let parent;
  try {
    switch(issue.fields.issuetype.name) {
      case 'Sub-task':
          parent = jiraClient.findIssue(issue.fields.parent.key)
            .then(p => findParent(jiraClient, p));
        break;
      case 'Story':
        if(issue.fields.issuelinks) {
          for(let i = 0; i < issue.fields.issuelinks.length; i++) {
            parent = issue.fields.issuelinks[i].inwardIssue;
            if(issue.fields.issuelinks[i].inwardIssue.fields.issuetype.name === 'Initiative') {
              break;
            }
          }
        }
        else {
          let epicLink = issue.fields.customfield_10805;

          if(epicLink !== null) {
            parent = jiraClient.findIssue(issue.fields.parent.key)
              .then(link => findParent(jiraClient, link));
            break;
          }
        }
        throw new Error('Cannot find parent.');
      case 'Epic':
        if(issue.fields.issuelinks) {
          for(let i = 0; i < issue.fields.issuelinks.length; i++) {
            parent = issue.fields.issuelinks[i].inwardIssue;
            if(issue.fields.issuelinks[i].inwardIssue.fields.issuetype.name === 'Initiative') {
              break;
            }
          }
        }
        break;
    }
  }
  catch(err) {
    console.log(err);
  }

  return parent;
}
