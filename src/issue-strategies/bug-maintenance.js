import * as inActive from '../validation-strategies/in-active-sprint';

export function apply(issue, jiraClientAPI) {
  if(issue === null || issue.fields.status.statusCategory.colorName !== 'yellow') {
    return Promise.reject(new Error(`Cannot commit against this issue ${issue.key}. Make sure the issue exists and has a yellow status`));
  }

  return inActive.withinActiveSprint(issue, jiraClientAPI)
    .then(() =>
      Promise.resolve(true)
    );
}
