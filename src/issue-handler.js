import strats from './validation-strategies/index';

export default function issueStrategizer(issues, jiraClientAPI) {
  return Promise.all(strats.map(s => s(issues, jiraClientAPI)))
    .then(() => {
      return Promise.resolve(true);
    })
    .catch(err => {
      return Promise.reject(err);
    });
}
