/* eslint no-process-exit:0 */
import fsp from 'fs-promise';
import _ from 'lodash';
import * as issueHandler from './issue-handler';
import {findProjectKey} from './jira-operations';
import {getJiraAPI} from './jira-connection';

export function getIssueReference(msgToParse, prjKey) {
  let pattern = RegExp(`${prjKey}-\\d+`, 'g');
  let commentPattern = RegExp(`^#.*$`, 'gm');

  msgToParse = msgToParse.replace(commentPattern, '');
  let references = msgToParse.match(pattern);

  return _.unique(references);
}

export function getCommitMsg(path) {
  return getJiraAPI()
    .then(jiraAPI => {
      let readFilePromise = fsp.readFile(path, {encoding:'utf8'});
      let projectKeyPromise = findProjectKey(jiraAPI);

      return Promise.all([readFilePromise, projectKeyPromise])
        .then(([fileContents, projectKey]) => getIssueReference(fileContents, findProjectKey(jiraAPI))
        )
        .then(issues => issueHandler.issueStrategizer(issues)
        );
    });
}

export function precommit(path) {
  return getCommitMsg(path)
    .then(() => 0)
    .catch(err => {
      if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
      } else {
        console.error(err.toString());
      }
      return 1;
    });
}
