import {findParentFolder, copyHookFiles, verifyHooksFolder} from './fs-utils.js';
import path from 'path';

if (process.env.TEAMCITY_VERSION) {
  console.log('TeamCity Detected not installing the commit hook');
  process.exit(0); // eslint-disable-line no-process-exit
}

let currentPath = process.cwd();

let gitPath;

console.log('Installing JIRA pre-commit hook....');

try {
  gitPath = findParentFolder(currentPath, '.git');
}
catch(error) {
  console.error('Your project needs a git repository to install the hook.');
}

console.log(`Found .git directory at: ${gitPath}`);

let hooksPath = path.join(gitPath, 'hooks');
verifyHooksFolder(hooksPath);

copyHookFiles(gitPath)
  .then(() => console.log('Copied commit hook.'))
  .catch(error => console.error(error));
