import echoTest from '../src/echoTest.js';

describe('Commit hook test', function() {
  it('Commit hook msg', () => {
    assert('Test', echoTest('Test'));
  });
});
