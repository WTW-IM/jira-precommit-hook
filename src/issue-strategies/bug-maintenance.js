export function apply(issue, jiraClientAPI) {
  if(issue === null || issue.fields.status.statusCategory.colorName !== 'yellow') {
    return Promise.reject(new Error(`Cannot commit against this issue ${issue.key}`));
  }

  return Promise.resolve(true);
}
