import {copyHookFiles} from '../src/install.js';
import path from 'path';
import fs from 'fs';

describe('Hook installation', () => {
	beforeEach(() => {
		if(!fs.existsSync('test/tmp')) {
			fs.mkdirSync('test/tmp');
			fs.mkdirSync('test/tmp/.git');
			fs.mkdirSync('test/tmp/.git/hooks');
		}

		if(fs.existsSync('test/tmp/.git/hooks/commit-msg')) {
			fs.unlinkSync('test/tmp/.git/hooks/commit-msg');
		}
	});

	it('Validate hook file is added', () => {
		let stream = copyHookFiles(path.join(__dirname, '/tmp/.git'));
		stream.on('close', () => {
			fs.existsSync('test/tmp/.git/hooks/commit-msg').should.equal(true);
		});
	});

	it('Validate hook file is correct', () => {
		let stream = copyHookFiles(path.join(__dirname, '/tmp/.git'));
		stream.on('close', () => {
			let newFile = fs.readFileSync('test/tmp/.git/hooks/commit-msg');
			let oldFile = fs.readFileSync('hooks/commit-msg');
			newFile.should.eql(oldFile);
		});
	});
});

