import {copyHookFiles} from '../src/fs-utils.js';
import path from 'path';
import fs from 'fs';
import fsp from 'fs-promise';

describe('Hook installation', () => {
	before(() => fsp.exists('test/tmp')
    .then(exists => {
      if(!exists) {
        fsp.mkdir('test/tmp')
        .then(() => fsp.mkdir('test/tmp/.git'))
        .then(() => fsp.mkdir('test/tmp/.git/hooks'));
        }
      }
    ));

  beforeEach(() => fsp.exists('test/tmp/.git/hooks/commit-msg')
    .then(exists => {
      if(exists) {
        return fsp.unlink('test/tmp/.git/hooks/commit-msg');
      }
  }));

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

