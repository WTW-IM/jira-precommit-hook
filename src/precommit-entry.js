/* eslint no-process-exit:0 */
import fsp from 'fs-promise';
import _ from 'lodash';

export function getIssueReference(msgToParse, prjKey) {
  let pattern = RegExp(`${prjKey}-\\d+`, 'g');
  let commentPattern = RegExp(`^#.*$`, 'gm');

  msgToParse = msgToParse.replace(commentPattern, '');
  let references = msgToParse.match(pattern);

  return _.unique(references);
}

export function getCommitMsg (path) {
  return fsp.readFile(path, {encoding:'utf8'})
    .then(fileContents => getIssueReference(fileContents, 'TW')) // TW will be replaced by a JIRA request being done by Steven and Curtis.
    .then(issues => issueStrategizer(issues)) // calls on Matthew's code to verify the integrity of the issues
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
