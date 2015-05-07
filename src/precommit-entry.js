/* eslint no-process-exit:0 */
import lodash from 'lodash';
import sinon from 'sinon';
import sPromise from 'sinon-as-promised';
import * as issueHandler from './issue-handler';
import os from 'os';

let eol = os.EOL;

export function getIssueReference(msgToParse, prjKey) {
  let pattern = RegExp(`${prjKey}-\\d+`, 'g');
  let commentPattern = RegExp(`^#.*$`, 'gm');

  msgToParse = msgToParse.replace(commentPattern, '');
  let references = msgToParse.match(pattern);

  return lodash.unique(references);
}

export function getCommitMsg (path) {
  let strategizerStub = sinon.stub(issueHandler, 'issueStrategizer', issues => {
    let jsonObjects = [
      {
        'issueType': {
          'name': 'Story'
        }
      },
      {
        'issueType': {
          'name': 'Story'
        }
      },
      {
        'issueType': {
          'name': 'Story'
        }
      }
    ];
    return jsonObjects;
  });

  let readFileStub = sinon.stub();
  readFileStub.resolves('TW-5032' + eol + 'TW-2380' + eol + 'TW-2018');

  return readFileStub(path)
    .then(fileContents => {
      getIssueReference(fileContents, 'TW');
    })
    .then(issues => strategizerStub(issues))
    .catch(err => {
      console.error(err);
    });

  // return fsp.readFile(path, {encoding:'utf8'})
  //   .then(fileContents => getIssueReference(fileContents, 'TW')) // TW will be replaced by a JIRA request being done by Steven and Curtis.
  //   .then(issues => issueHandler.issueStrategizer(issues)) // calls on Matthew's code to verify the integrity of the issues
  //   .catch(err => {
  //     console.error(err);
  //     process.exit(1);
  //   });
}
