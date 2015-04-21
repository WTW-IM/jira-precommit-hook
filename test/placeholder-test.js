import precommit from '../src/precommit-entry.js';

describe('Commit hook test', function() {
  it('Commit hook msg', done => {

    let msg = precommit('test/test.txt');
    msg.should.eventually.equal('hello')
		.notify(done);
  });
});
