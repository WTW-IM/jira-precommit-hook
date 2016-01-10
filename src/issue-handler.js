import strats from './validation-strategies/index';

export async function issueStrategizer(issues, jiraClientAPI) {
  await Promise.all(strats.map(strat => strat(issues, jiraClientAPI)));
  return true;
}
