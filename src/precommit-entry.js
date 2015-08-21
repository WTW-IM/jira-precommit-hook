/* eslint no-process-exit:0 */
import fsp from 'fs-promise';
import _ from 'lodash';
import * as issueHandler from './issue-handler';
import {findProjectKey} from './jira-operations';
import {getJiraAPI} from './jira-connection';
import * as fsUtils from './fs-utils';
import checkOutdated from './outdated-check';
import 'colors';

export function getIssueReference(msgToParse, prjKey) {
  let pattern = RegExp(`${prjKey}-\\d+`, 'g');
  let commentPattern = RegExp(`^#.*$`, 'gm');

  msgToParse = msgToParse.replace(commentPattern, '');
  let references = msgToParse.match(pattern);

  return _.unique(references);
}

export function getCommitMsg(readPromise) {
  let jiraAPI, jiraConfigPath;

  try {
    jiraConfigPath = fsUtils.findParentFolder(process.cwd(), '.jirarc');
  } catch (err) {
    return Promise.reject(new Error('.jirarc file is not found. Please refer to the readme for details about the .jirarc file'));
  }

  return Promise.all([
    getJiraAPI(jiraConfigPath)
      .then(api => jiraAPI = api)
      .then(() => findProjectKey(jiraAPI)),
    readPromise
  ])
  .then(([projectKey, fileContents]) => {
    let firstWord = fileContents.split(' ')[0];

    if(firstWord === 'Merge' || firstWord === 'Revert') {
      return null;
    }

     let issues = getIssueReference(fileContents, projectKey);
     return issueHandler.issueStrategizer(issues, jiraAPI);
  });
}

export function precommit(path) {
  return checkOutdated()
    .then(() => {
      let readPromise = fsp.readFile(path, {encoding: 'utf8'});

      return getCommitMsg(readPromise)
        .then(() => {
          console.log('[jira-precommit-hook] '.grey + 'Commit message successfully verified.'.cyan);
          return 0;
        })
        .catch(err => {
          return readPromise
            .then(contents => {
              console.log('Commit Message:');
              console.log(contents);

              if (typeof err === 'string') {
                console.error(err.red);
              }
              else if (process.env.NODE_ENV === 'development') {
                console.error(err.stack.red);
              }
              else {
                console.error(err.toString().red);
              }

              return 1;
            })
            .catch(err2 => {
              console.log('Failed to read commit message file.'.red);
              return 1;
            });
        });
    });
}
