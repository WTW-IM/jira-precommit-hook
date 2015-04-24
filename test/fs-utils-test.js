import {findParentFolder} from '../src/fs-utils.js';
import path from 'path';

describe('Finding .git folder', () => {
	it('.git folder is found from test', () => {
		let gitPath = findParentFolder(__dirname, '.git');

		gitPath.should.equal(path.join(__dirname, '../.git'));
	});

	it('error is thrown if no .git folder exists', () => {
		let fn = () => { findParentFolder(path.join(__dirname, '../../')); };
		expect(fn).to.throw(Error);
	});
});
