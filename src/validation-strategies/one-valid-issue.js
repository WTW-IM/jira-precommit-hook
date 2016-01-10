import issueStrats from '../issue-strategies/index.js';
import * as promiseUtils from '../promise-utils.js';

async function validateStrategies(issueKey, jiraClientAPI) {
  const content = await jiraClientAPI.findIssue(issueKey);

  if (!issueStrats[content.fields.issuetype.name]) {
    return issueStrats.Unknown.apply(content, jiraClientAPI);
  }

  return issueStrats[content.fields.issuetype.name].apply(content, jiraClientAPI);
}

export default function apply(issues, jiraClientAPI) {
  return promiseUtils.anyPromise(issues.map(i => validateStrategies(i, jiraClientAPI)));
}
