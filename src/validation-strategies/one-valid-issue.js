import issueStrats from '../issue-strategies/index.js';
import * as promiseUtils from '../promise-utils.js';

function validateStrategies(issueKey, jiraClientAPI) {
  return jiraClientAPI.findIssue(issueKey)
    .then(content =>
      issueStrats[content.fields.issuetype.name].apply(content, jiraClientAPI)
    )
    .catch(content => Promise.reject(new Error(`${issueKey} does not have a valid issuetype`)));
}

export default function apply(issues, jiraClientAPI) {
  return promiseUtils.anyPromise(issues.map(i => validateStrategies(i, jiraClientAPI)));
}
