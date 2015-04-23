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
		if(fs.existsSync(path.join(gitPath, '/.git'))) {
			gitPath = path.join(gitPath, '/.git');
			break;
		}
		else {
			let tempPath = gitPath;
			gitPath = path.normalize(path.join(gitPath, '/..'));

			if(gitPath === tempPath) {
				throw new Error('Cannot find Git Folder!!');
			}
		}
	}

	return gitPath;
}

export function copyHookFiles(gitDirectory) {
	fs.createReadStream(path.resolve(path.join(__dirname, '../hooks/commit-msg')))
	.pipe(fs.createWriteStream(path.join(gitDirectory, '/hooks/commit-msg')));
}
