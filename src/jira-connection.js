import { getAPIConfig } from './jira-configuration.js';
import { JiraApi } from 'jira';
import _ from 'lodash';

function promisify(func) {
  return function promiseFunc(...args) {
    return new Promise((fulfill, reject) => {
      args.push((error, result) => {
        if (!error) {
          fulfill(result);
        } else {
          return reject(error);
        }
      });

      func.apply(this, args);
    });
  };
}

Object.keys(JiraApi.prototype).forEach(key => {
  const currentProperty = JiraApi.prototype[key];

  if (typeof currentProperty === 'function') {
    JiraApi.prototype[key] = _.memoize(promisify(currentProperty));
  }
});

// Grabs data from files and returns a JIRA connection object wrapped in promise
export function getJiraAPI(configPath) {
  return getAPIConfig(configPath)
    .then(({ projectName, protocol, host, port, version, verbose, strictSSL }) => {
      const jiraClient = new JiraApi(protocol, host, port, '', '', version, verbose, strictSSL);

      // Temporary hack until resolved: https://github.com/steves/node-jira/pull/107
      jiraClient.doRequest = (options, callback) => {
        jiraClient.request(options, callback);
      };

      jiraClient.projectName = projectName;

      return jiraClient;
    });
}
