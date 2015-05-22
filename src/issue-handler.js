import strats from './validation-strategies/index';

export function issueStrategizer(issues, jiraClientAPI) {
  return Promise.all(strats.map(s => s(issues, jiraClientAPI)))
    .then(() => true);
}
