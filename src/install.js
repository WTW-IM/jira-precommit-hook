import {findParentFolder, copyHookFiles, verifyHooksFolder} from './fs-utils.js';
import path from 'path';

export default function install() {
  const thisProjectsGitFolder = path.resolve(path.join(__dirname, '../.git'));
  let gitPath = findParentFolder(__dirname, '.git');

  if (thisProjectsGitFolder === gitPath) {
    return Promise.resolve(0);
  }

  console.log('Installing JIRA pre-commit hook....');

  try {
    gitPath = findParentFolder(__dirname, '.git');
  } catch (error) {
    return Promise.reject('Your project needs a git repository to install the hook.');
  }

  console.log(`Found .git directory at: ${gitPath}`);

  const hooksPath = path.join(gitPath, 'hooks');
  verifyHooksFolder(hooksPath);

  return copyHookFiles(gitPath)
    .then(() => console.log('Copied commit hook.'));
}
