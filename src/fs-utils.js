import fs from 'fs';
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
  return fs.createReadStream(path.resolve(path.join(__dirname, '../hooks/commit-msg')))
  .pipe(fs.createWriteStream(path.join(gitDirectory, '/hooks/commit-msg')));
}
