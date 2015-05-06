import strats from 'strategies/index';

function validateStrategies(issue) {
  let issueJSON = stevesStuff(issue); //Gets the jira issue json file
  return strats.filter(s => s.matches(issueJSON.fields.issueType.name))
    .reduce((acc, s) =>
      acc.then(() => s.apply()), Promise.resolve());
}

export function issueStrategizer(issues) {
  return issues.map(i => validateStrategies(i));
}
