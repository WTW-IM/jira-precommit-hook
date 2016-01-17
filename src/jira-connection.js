import { getAPIConfig } from './jira-configuration.js';
import JiraApi from 'jira-client';
import _ from 'lodash';

class OurJiraApi extends JiraApi {
  constructor(config) {
    super(config);
  }

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
    projectName,
    ...config
  } = await getAPIConfig(configPath);

  const jiraClient = new OurJiraApi(config);

  jiraClient.projectName = projectName;
  return jiraClient;
}
