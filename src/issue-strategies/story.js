import * as jiraOperations from '../jira-operations.js';

function areParentsYellow(parentIssue, jiraClientAPI) {
  return parentIssue
    .then(content => {
      if(content === null || content.fields.status.statusCategory.colorName !== 'yellow') {
        return Promise.reject(new Error(`Cannot commit against this issue`));
      } else if(content.fields.issuetype.name === 'Initiative') {
        return Promise.resolve(true);
      }
      return areParentsYellow(jiraOperations.findParent(content, jiraClientAPI), jiraClientAPI);
    });
}

export function apply(issue, jiraClientAPI) {
  if(issue === null || issue.fields.status.statusCategory.colorName !== 'yellow') {
    return Promise.reject(new Error(`Cannot commit against this issue ${issue.key}`));
  }

  return areParentsYellow(jiraOperations.findParent(issue, jiraClientAPI), jiraClientAPI);
}
