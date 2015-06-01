import fs from 'fs';
import fsp from 'fs-promise';
import path from 'path';

export function findParentFolder(startDir, parentDirName) {
  let currentDir = startDir;

  while(fs.existsSync(currentDir)) {
    if(fs.existsSync(path.join(currentDir, parentDirName))) {
      currentDir = path.join(currentDir, parentDirName);
      break;
    }
    else {
      let tempPath = currentDir;
      currentDir = path.normalize(path.join(currentDir, '/..'));

      if(currentDir === tempPath) {
        throw new Error(`Cannot find ${parentDirName}`);
      }
    }
  }

  return currentDir;
}

export function copyHookFiles(gitDirectory) {
  let source = path.join(__dirname, '../hooks/commit-msg');
  let destination = path.join(gitDirectory, '/hooks/commit-msg');
  let stat = fs.statSync(source);

  return new Promise((fulfill, reject) => {
    fs.createReadStream(source)
    .pipe(fs.createWriteStream(destination, { mode: stat.mode }))
      .on('close', (error, result) => {
        if(error) {
          reject(error);
        }
        else {
          fulfill(result);
        }
      });
  });
}

export function getFilePath(startDir, desiredFileName){
  let currentDir = startDir;

  while(fs.existsSync(currentDir)) {
    if(fs.existsSync(path.join(currentDir, desiredFileName))) {
      currentDir = path.join(currentDir, desiredFileName);
      break;
    } else {
      let tempPath = currentDir;
      currentDir = path.normalize(path.join(currentDir, '/..'));

      if(currentDir === tempPath) {
        throw new Error(`Cannot find ${desiredFileName}`);
      }
    }
  }

  return currentDir;
}

export function readJSON(filePath){
  return fsp.readFile(filePath)
    .then(content => JSON.parse(content));
}
