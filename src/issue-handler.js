import strats from './strategies/index';

function validateStrategies(issueKey) {
  let issueJSON = retrieveIssue(issueKey);
  return strats.filter(s => s.matches(issueJSON.fields.issueType.name))
    .reduce((acc, s) =>
      acc.then(() => s.apply()), Promise.resolve());
}

export function issueStrategizer(issues) {
  return issues.map(i => validateStrategies(i));
}
