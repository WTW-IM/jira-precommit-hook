import * as jiraOperations from '../jira-operations.js';
import * as bugMtStrat from './bug-maintenance.js';

function areParentsValid(baseIssueKey, parentIssue, jiraClientAPI) {
  return parentIssue
    .then(content => {
      if(!content) {
        return Promise.reject(new Error(`Cannot commit issue ${baseIssueKey} because no parent issue can be found. (You may not have the required permissions to see the parent issue)`));
      }

      if(content.fields.status.statusCategory.colorName !== 'yellow') {
        return Promise.reject(new Error(`Cannot commit issue ${baseIssueKey} because parent issue ${content.key} is not available to commit against.`));
      }

      if(content.fields.issuetype.name === 'Maintenance Task' || content.fields.issuetype.name === 'Bug'){
        return bugMtStrat.apply(content, jiraClientAPI);
      }

      if(content.fields.issuetype.name === 'MT' ||  // TODO: Is this one old??
        content.fields.issuetype.name === 'Initiative' ||
        content.fields.issuetype.name === 'Dispatcher'){
        return Promise.resolve(true);
      }

      return areParentsValid(baseIssueKey, jiraOperations.findParent(content, jiraClientAPI), jiraClientAPI);
    });
}

export function apply(issue, jiraClientAPI) {
  if(issue === null || issue.fields.status.statusCategory.colorName !== 'yellow') {
    return Promise.reject(new Error(`Issue ${issue.key} is not open to commit against`));
  }

  return areParentsValid(issue.key, jiraOperations.findParent(issue, jiraClientAPI), jiraClientAPI);
}
