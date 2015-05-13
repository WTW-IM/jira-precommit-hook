export function apply(issues, jiraClientAPI) {
  if(issues.length === 0) {
    return Promise.reject(new Error('Must commit agianst at least one issue.'));
  }
  return Promise.resolve(true);
}
