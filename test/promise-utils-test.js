import * as promiseUtils from '../src/promise-utils.js';

describe('Any Promise Tests', () => {
  it('No args', done => {
    promiseUtils.anyPromise().should.eventually.be.rejectedWith(Error, 'No arguments provided').notify(done);
  });

  it('Non-array argument', done => {
    let testArgs = 0;
    promiseUtils.anyPromise(testArgs).should.eventually.be.rejectedWith(Error, 'Argument is not a non-array').notify(done);
  });

  it('Empty array', done => {
    let testArgs = [];
    promiseUtils.anyPromise(testArgs).should.eventually.be.rejectedWith(Error, 'Argument is not a non-array').notify(done);
  });

  it('Successful single promise', done => {
    let testPromiseArray = [Promise.resolve(true)];
    promiseUtils.anyPromise(testPromiseArray).should.eventually.equal(true).notify(done);
  });

  it('Unsuccessful single promise', done => {
    let testPromiseArray = [Promise.reject(new Error('Failed'))];
    promiseUtils.anyPromise(testPromiseArray).should.eventually.be.rejectedWith(Error, 'Failed').notify(done);
  });

  it('1 successful and 1 incomplete promise', done => {
    let testPromiseArray = [Promise.resolve(true), new Promise(() => {})];
    promiseUtils.anyPromise(testPromiseArray).should.eventually.equal(true).notify(done);
  });

  it('1 incomplete and 1 successful promise', done => {
    let testPromiseArray = [new Promise(() => {}), Promise.resolve(true)];
    promiseUtils.anyPromise(testPromiseArray).should.eventually.equal(true).notify(done);
  });

  it('1 successful and 1 failure', done => {
    let testPromiseArray = [Promise.resolve(true), Promise.reject(new Error('Failed'))];
    promiseUtils.anyPromise(testPromiseArray).should.eventually.equal(true).notify(done);
  });

  it('1 failure and 1 successful', done => {
    let testPromiseArray = [Promise.reject(new Error('Failed')), Promise.resolve(true)];
    promiseUtils.anyPromise(testPromiseArray).should.eventually.equal(true).notify(done);
  });

  it('2 failures', done => {
    let err1 = new Error('Error 1');
    let err2 = new Error('Error 2');
    let testPromiseArray = [Promise.reject(err1), Promise.reject(err2)];
    promiseUtils.anyPromise(testPromiseArray).should.eventually.be.rejectedWith([err1, err2]).notify(done);
  });

  it('3 failures', done => {
    let err1 = new Error('Error 1');
    let err2 = new Error('Error 2');
    let err3 = new Error('Error 3');
    let testPromiseArray = [Promise.reject(err1), Promise.reject(err2), Promise.reject(err3)];
    promiseUtils.anyPromise(testPromiseArray).should.eventually.be.rejectedWith([err1, err2, err3]).notify(done);
  });

  it('2 failures and 1 successful', done => {
    let err1 = new Error('Error 1');
    let err2 = new Error('Error 2');
    let testPromiseArray = [Promise.reject(err1), Promise.reject(err2), Promise.resolve(true)];
    promiseUtils.anyPromise(testPromiseArray).should.eventually.be.equal(true).notify(done);
  });
});
