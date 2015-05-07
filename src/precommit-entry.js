/* eslint no-process-exit:0 */
import fsp from 'fs-promise';
import _ from 'lodash';
import * as issueHandler from './issue-handler';

export function getIssueReference(msgToParse, prjKey) {
  let pattern = RegExp(`${prjKey}-\\d+`, 'g');
  let commentPattern = RegExp(`^#.*$`, 'gm');

  msgToParse = msgToParse.replace(commentPattern, '');
  let references = msgToParse.match(pattern);

  return _.unique(references);
}

export function getCommitMsg (path) {
   return fsp.readFile(path, {encoding:'utf8'})
    .then(fileContents => {
      getIssueReference(fileContents, 'TW');
    })
    .then(issues => issueHandler.issueStrategizer(issues))
    .catch(err => {
      console.log('Welcome to getCommitMsg');
      console.error(err);
      process.exit(1);
    });
}
