import { getAPIConfig } from './jira-configuration.js';
import JiraApi from 'jira-client';
import _ from 'lodash';

class OurJiraApi extends JiraApi {
  findIssue(issueNumber) {
    if (!this._findIssueCache) {
      this._findIssueCache = _.memoize(super.findIssue);
    }

    return this._findIssueCache(issueNumber);
  }
}

// Grabs data from files and returns a JIRA connection object wrapped in promise
export async function getJiraAPI(configPath) {
  const {
    projectName, // eslint-disable-line no-use-before-define
    ...config // eslint-disable-line no-use-before-define
  } = await getAPIConfig(configPath);

  const jiraClient = new OurJiraApi(config);

  jiraClient.projectName = projectName;
  return jiraClient;
}
