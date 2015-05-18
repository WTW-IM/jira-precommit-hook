export function apply(issue, jiraClientAPI) {
  return Promise.reject(new Error('Cannot commit against against an epic.'));
}
