import { findParentFolder, copyHookFiles, verifyHooksFolder } from './fs-utils.js';
import fsp from 'fs-promise';
import path from 'path';

export default async function install() {
  const thisProjectsGitFolder = path.resolve(path.join(__dirname, '../.git'));
  let gitPath = findParentFolder(__dirname, '.git');

  if (thisProjectsGitFolder === gitPath) {
    return 0;
  }

  console.log('Installing JIRA pre-commit hook....');

  try {
    gitPath = findParentFolder(__dirname, '.git');
  } catch (error) {
    throw new Error('Your project needs a git repository to install the hook.');
  }

  if ((await fsp.stat(gitPath)).isFile()) {
    console.log('Attempting install to git worktree, please install in the ' +
                'primary worktree directory.');
    return 0;
  }

  console.log(`Found .git directory at: ${gitPath}`);

  const hooksPath = path.join(gitPath, 'hooks');
  verifyHooksFolder(hooksPath);

  await copyHookFiles(gitPath);
  console.log('Copied commit hook.');
  return 0;
}
