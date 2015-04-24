import fs from 'fs';
import path from 'path';
import {findParentFolder} from '../src/fs-utils.js';

 let currentPath = process.env.pwd;

try{
	copyHookFiles(findParentFolder(currentPath, '.git'));
} catch(error) {
	console.log(error.message);
}

export function copyHookFiles(gitDirectory) {
	return fs.createReadStream(path.resolve(path.join(__dirname, '../hooks/commit-msg')))
	.pipe(fs.createWriteStream(path.join(gitDirectory, '/hooks/commit-msg')));
}
