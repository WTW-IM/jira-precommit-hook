import fsys from 'fs';
import fsp from 'fs-promise';
import path from 'path';

export function findParentFolder(startDir, parentDirName) {
  let currentDir = startDir;

  while (fsys.existsSync(currentDir)) {
    if (fsys.existsSync(path.join(currentDir, parentDirName))) {
      currentDir = path.join(currentDir, parentDirName);
      break;
    } else {
      const tempPath = currentDir;
      currentDir = path.normalize(path.join(currentDir, '/..'));

      if (currentDir === tempPath) {
        throw new Error(`Cannot find ${parentDirName}`);
      }
    }
  }

  return currentDir;
}

export function verifyHooksFolder(desiredHooksPath) {
  if (!fsys.existsSync(desiredHooksPath)) {
    console.log('Creating hooks directory in .git');
    fsys.mkdirSync(desiredHooksPath);
  }
}

export function copyHookFiles(gitDirectory) {
  const source = path.join(__dirname, '../hooks/commit-msg');
  const destination = path.join(gitDirectory, '/hooks/commit-msg');
  const stat = fsys.statSync(source);

  return new Promise((fulfill, reject) => {
    fsys.createReadStream(source)
    .pipe(fsys.createWriteStream(destination, { mode: stat.mode }))
      .on('close', (error, result) => {
        if (error) {
          reject(error);
        } else {
          fulfill(result);
        }
      });
  });
}

export function readJSON(filePath) {
  return fsp.readFile(filePath)
    .then(content => JSON.parse(content));
}
