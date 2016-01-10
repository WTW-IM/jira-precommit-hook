import * as jiraOperations from '../jira-operations.js';

async function areParentsValid(baseIssueKey, parentIssue, jiraClientAPI) {
  const parent = await parentIssue;

  if (parent === null || parent.fields.status.statusCategory.colorName !== 'yellow') {
    throw new Error(`Cannot commit issue ${baseIssueKey} because parent issue ${parent.key} is not available to commit against.`);
  } else if (parent.fields.issuetype.name === 'Maintenance Task' ||
             parent.fields.issuetype.name === 'Bug' ||
             parent.fields.issuetype.name === 'Initiative') {
    return true;
  }

  const grandparent = await jiraOperations.findParent(parent, jiraClientAPI);

  return areParentsValid(baseIssueKey, grandparent, jiraClientAPI);
}

export async function apply(issue, jiraClientAPI) {
  if (issue === null || issue.fields.status.statusCategory.colorName !== 'yellow') {
    throw new Error(`Issue ${issue.key} is not open to commit against`);
  }

  const parent = await jiraOperations.findParent(issue, jiraClientAPI);
  return areParentsValid(issue.key, parent, jiraClientAPI);
}
