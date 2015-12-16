import strats from './validation-strategies/index';

export function issueStrategizer(issues, jiraClientAPI) {
  return Promise.all(strats.map(strat => strat(issues, jiraClientAPI)))
    .then(() => true);
}
