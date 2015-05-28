export function apply(issue, jiraClientAPI) {
  return Promise.reject(new Error(`Cannot commit against ${issue.key}. It is an initiative.`));
}
