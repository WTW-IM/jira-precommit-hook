import issueStrats from '../issue-strategies/index';

function validateStrategies(issueKey, jiraClientAPI) {

}

export function apply(issues, jiraClientAPI) {
  return Promise.any(issues.map(i => validateStrategies(i, jiraClientAPI)));
}
