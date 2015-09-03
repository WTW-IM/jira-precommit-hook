import * as jiraOperations from '../jira-operations.js';

function areParentsValid(baseIssueKey, parentIssue, jiraClientAPI) {
  return parentIssue
    .then(content => {
      if(content === null || content.fields.status.statusCategory.colorName !== 'yellow') {
        return Promise.reject(new Error(`Cannot commit issue ${baseIssueKey} because parent issue ${content.key} is not available to commit against.`));
      } else if(content.fields.issuetype.name === 'MT' ||  // TODO: Is this one old??
                content.fields.issuetype.name === 'Maintenance Task' ||
                content.fields.issuetype.name === 'Bug' ||
                content.fields.issuetype.name === 'Initiative' ||
                content.fields.issuetype.name === 'Dispatcher')
      {
        if((content.fields.issuetype.name === 'Maintenance Task' || content.fields.issuetype.name === 'Bug') && content.fields.issuelinks !== undefined)
        {
          return jiraOperations.findParent(content, jiraClientAPI).then((parent)=>
          {
            return parent.fields.status.statusCategory.colorName === 'yellow' ? Promise.resolve(true) :Promise.reject(new Error(`Cannot commit issue ${content.key} because parent issue ${parent.key} is not available to commit against.`));
          });
        }
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
