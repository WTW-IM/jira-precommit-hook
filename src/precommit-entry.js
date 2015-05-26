/* eslint no-process-exit:0 */
import fsp from 'fs-promise';
import _ from 'lodash';
import * as issueHandler from './issue-handler';
import {findProjectKey} from './jira-operations';
import {getJiraAPI} from './jira-connection';
import * as fsUtils from './fs-utils';
import 'colors';

export function getIssueReference(msgToParse, prjKey) {
  let pattern = RegExp(`${prjKey}-\\d+`, 'g');
  let commentPattern = RegExp(`^#.*$`, 'gm');

  msgToParse = msgToParse.replace(commentPattern, '');
  let references = msgToParse.match(pattern);

  return _.unique(references);
}

export function getCommitMsg(path) {
  let jiraConfigPath;
  try {
    jiraConfigPath = fsUtils.getFilePath(process.cwd(), '.jirarc');
  } catch (err) {
    return Promise.reject(new Error('.jirarc file is not found. Please refer to the readme for details about the .jirarc file'));
  }
  return getJiraAPI(jiraConfigPath)
    .then(jiraAPI => {
      let readFilePromise = fsp.readFile(path, {encoding:'utf8'});
      let projectKeyPromise = findProjectKey(jiraAPI);

      return Promise.all([readFilePromise, projectKeyPromise])
        .then(([fileContents, projectKey]) => getIssueReference(fileContents, findProjectKey(jiraAPI)))
        .then(issues => issueHandler.issueStrategizer(issues, jiraAPI));
    });
}

export function precommit(path) {
  return getCommitMsg(path)
    .then(() => 0)
    .catch(err => {
      if (typeof err === 'string') {
        console.error(err.red);
      } else if (process.env.NODE_ENV === 'development') {
        console.error(err.stack.red);
      } else {
        console.error(err.toString().red);
      }
      return 1;
    });
}
