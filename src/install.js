import fs from 'fs';
import path from 'path';

let currentPath = process.env.pwd;

while(fs.existsSync(currentPath)) {
	if(fs.existsSync(currentPath + '/.git'))
	{
		currentPath = currentPath + '/.git/hooks/';
		break;
	}
	else
	{
		currentPath = path.normalize(currentPath + '/..');
	}
}

fs.createReadStream('hooks/commit-msg').pipe(fs.createWriteStream(currentPath + 'commit-msg'));
