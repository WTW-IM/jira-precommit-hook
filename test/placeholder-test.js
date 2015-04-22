import precommit from '../src/precommit-entry.js';
import fs from 'fs';
import {findGitFolder, copyHookFiles} from '../src/install.js';
import path from 'path';

describe('Commit hook test', function() {
  it('Commit hook msg', done => {

    let msg = precommit('test/test.txt');
    msg.should.eventually.equal('hello')
		.notify(done);
  });
});

describe('Finding .git folder', function() {
	it('.git folder is found from test', function(){
		let gitPath = findGitFolder(__dirname);

		gitPath.should.equal(path.join(__dirname, '../.git'));
	});
	it('error is thrown if no .git folder exists', function(){
		let fn = function() { findGitFolder(path.join(__dirname, '../../')); };
		expect(fn).to.throw(Error);
	});
});

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

