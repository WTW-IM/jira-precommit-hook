/* eslint no-process-exit:0 */
import fsp from 'fs-promise';
import _ from 'lodash';
import * as issueHandler from './issue-handler';
import { findProjectKey } from './jira-operations';
import { getJiraAPI } from './jira-connection';
import * as fsUtils from './fs-utils';
import checkOutdated from './outdated-check';
import 'colors';
import ChuckClient from './chuck-client';

export function getIssueReference(msgToParse, prjKey) {
  const pattern = RegExp(`${prjKey}-\\d+`, 'g');
  const commentPattern = RegExp(`^#.*$`, 'gm');

  const msgToParseReplaced = msgToParse.replace(commentPattern, '');
  const references = msgToParseReplaced.match(pattern);

  return _.uniq(references);
}

export async function getCommitMsg(readPromise) {
  let jiraAPI;
  let jiraConfigPath;

  try {
    jiraConfigPath = fsUtils.findParentFolder(process.cwd(), '.jirarc');
  } catch (err) {
    throw new Error('.jirarc file is not found. Please refer to the readme for details about the .jirarc file');
  }

  const [projectKey, fileContents] = await Promise.all([
    getJiraAPI(jiraConfigPath)
      .then(api => jiraAPI = api)
      .then(() => findProjectKey(jiraAPI)),
    readPromise
  ]);

  const firstWord = fileContents.split(' ')[0];

  if (firstWord === 'Merge') {
    return null;
  }

  const issues = getIssueReference(fileContents, projectKey);
  return issueHandler.issueStrategizer(issues, jiraAPI);
}

export async function precommit(path) {
  await checkOutdated();

  const readPromise = fsp.readFile(path, { encoding: 'utf8' });

  try {
    await getCommitMsg(readPromise);
    console.log('[jira-precommit-hook] '.grey + 'Commit message successfully verified.'.cyan);
    const client = new ChuckClient();

    if (client.isChuckEnabled()) {
      try {
        const joke = await client.getRandomJoke();
        console.log(`Good work now enjoy this joke. You deserve it!\n\n${joke}\n`);
      } catch (jokeErr) { } // eslint-disable-line
    }

    return 0;
  } catch (err) {
    try {
      const contents = await readPromise;
      console.log('Commit Message:');
      console.log(contents);

      if (typeof err === 'string') {
        console.error(err.red);
      } else if (process.env.NODE_ENV === 'development') {
        console.error(err.stack.red);
      } else {
        console.error(err.toString().red);
      }

      return 1;
    } catch (err2) {
      console.log('Failed to read commit message file.'.red);
      return 1;
    }
  }
}
