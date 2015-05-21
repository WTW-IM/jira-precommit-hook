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

export function getCommitMsg (path) {
  return getJiraAPI()
    .then(jiraAPI =>
    {
      return fsp.readFile(path, {encoding:'utf8'})
        .then(fileContents =>
          getIssueReference(fileContents, findProjectKey(jiraAPI))
        )
        .then(issues => {
          issueHandler.issueStrategizer(issues);
          process.exit(0);
        })
        .catch(err => {
          console.error(err);
          process.exit(1);
        });
    });
}
