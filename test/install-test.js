import {copyHookFiles} from '../src/install.js';
import path from 'path';
import fs from 'fs';

describe('Hook installation', () => {
	it('Validate hook file is added', done => {
		if(!fs.existsSync('test/tmp')){
			fs.mkdirSync('test/tmp');
			fs.mkdirSync('test/tmp/.git');
			fs.mkdirSync('test/tmp/.git/hooks');
		}

		copyHookFiles(path.join(__dirname, '/tmp/.git'));
		done();
		fs.existsSync('test/tmp/.git/hooks/commit-msg').should.equal(true);
	});
	it('Validate hook file is correct', () => {
		let newFile = fs.readFileSync('test/tmp/.git/hooks/commit-msg');
		let oldFile = fs.readFileSync('hooks/commit-msg');
		newFile.should.eql(oldFile);
	});
});

