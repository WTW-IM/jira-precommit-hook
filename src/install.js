import fs from 'fs';
import path from 'path';

let currentPath = process.env.pwd;

try{
	copyHookFiles(findGitFolder(currentPath));
} catch(error) {
	console.log(error.message);
}

export function findGitFolder(startDirectory) {
	let gitPath = startDirectory;

	while(fs.existsSync(gitPath)) {
		if(fs.existsSync(gitPath + '\\.git')) {
			gitPath = gitPath + '\\.git';
			break;
		}
		else {
			let tempPath = gitPath;
			gitPath = path.normalize(gitPath + '\\..');

			if(gitPath === tempPath) {
				throw new Error('Cannot find Git Folder!!');
			}
		}
	}

	return gitPath;
}

export function copyHookFiles(gitDirectory) {
	fs.createReadStream(path.resolve(path.join(__dirname, '..\\hooks\\commit-msg')))
	.pipe(fs.createWriteStream(gitDirectory + '\\hooks\\commit-msg'));
}
