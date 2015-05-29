import {findParentFolder, copyHookFiles} from './fs-utils.js';

let currentPath = process.env.pwd;

let gitPath;

console.log('Installing JIRA pre-commit hook....');

try {
  gitPath = findParentFolder(currentPath, '.git');
}
catch(error) {
  console.error('Your project needs a git repository to install the hook.');
}

console.log(`Found .git directory at: ${gitPath}`);

copyHookFiles(gitPath)
  .then(() => console.log('Copied commit hook.'))
  .catch(error => console.error(error));
