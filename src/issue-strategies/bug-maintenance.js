export function apply(issue, jiraClientAPI) {
  if (issue === null || issue.fields.status.statusCategory.colorName !== 'yellow') {
    return Promise.reject(new Error(`Issue ${issue.key} is not open to commit against`));
  }

  return Promise.resolve(true);
}
