import precommit from '../src/precommit-entry.js';

describe('precommit-entry test', () => {
  it('Commit hook msg', done => {

    let msg = precommit('test/test.txt');
    msg.should.eventually.equal('hello')
		.notify(done);
  });
});

describe('Issue number test', () => {
	it('Parse issue number, no issue numbers found');

	it('Parse issue number');

	it('Parse multiple issue numbers');

	it('Parse issue number, ignore issue numbers in comments');
});

describe('Story test', () => {
	it('Story does not exist');
});

describe('Initive test', () => {
	it('Find parent initive');
});
