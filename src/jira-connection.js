import {getFilePath} from './fs-utils.js';
import {getAPIConfig} from './jira-configuration.js';
import {JiraApi} from 'jira';

function promisify(func) {
  return function(...args) {
    return new Promise((fulfill, reject) => {
      args.push((error, result) => {
        if(error) {
          return reject(error);
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
  return getAPIConfig(getFilePath(process.cwd(), '.jirarc'))
    .then(({projectName, protocol, host, port, version, verbose, strictSSL}) => {
      let jiraClient = new JiraApi(protocol, host, port, '', '', version, verbose, false);

      //Temporary hack until resolved: https://github.com/steves/node-jira/pull/107
      jiraClient.doRequest = function(options, callback) {
        jiraClient.request(options, callback);
      };

      jiraClient.projectName = projectName;

      return jiraClient;
    });
}
