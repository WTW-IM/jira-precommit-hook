import * as promiseUtils from '../src/promise-utils.js';

describe('Any Promise Tests', () => {
  it('No args', () => {
    return promiseUtils.anyPromise().should.eventually.be.rejectedWith(Error, 'No arguments provided');
  });

  it('Non-array argument', () => {
    const testArgs = 0;
    return promiseUtils.anyPromise(testArgs).should.eventually.be.rejectedWith(Error, 'Argument is not a non-array');
  });

  it('Empty array', () => {
    const testArgs = [];
    return promiseUtils.anyPromise(testArgs).should.eventually.be.rejectedWith(Error, 'Argument is not a non-array');
  });

  it('Successful single promise', () => {
    const testPromiseArray = [Promise.resolve(true)];
    return promiseUtils.anyPromise(testPromiseArray).should.eventually.equal(true);
  });

  it('Unsuccessful single promise', () => {
    const testPromiseArray = [Promise.reject(new Error('Failed'))];
    return promiseUtils.anyPromise(testPromiseArray).should.eventually.be.rejectedWith(Error, 'Failed');
  });

  it('1 successful and 1 incompconste promise', () => {
    const testPromiseArray = [Promise.resolve(true), new Promise(() => {})];
    return promiseUtils.anyPromise(testPromiseArray).should.eventually.equal(true);
  });

  it('1 incompconste and 1 successful promise', () => {
    const testPromiseArray = [new Promise(() => {}), Promise.resolve(true)];
    return promiseUtils.anyPromise(testPromiseArray).should.eventually.equal(true);
  });

  it('1 successful and 1 failure', () => {
    const testPromiseArray = [Promise.resolve(true), Promise.reject(new Error('Failed'))];
    return promiseUtils.anyPromise(testPromiseArray).should.eventually.equal(true);
  });

  it('1 failure and 1 successful', () => {
    const testPromiseArray = [Promise.reject(new Error('Failed')), Promise.resolve(true)];
    return promiseUtils.anyPromise(testPromiseArray).should.eventually.equal(true);
  });

  it('2 failures', () => {
    const err1 = new Error('Error 1');
    const err2 = new Error('Error 2');
    const testPromiseArray = [Promise.reject(err1), Promise.reject(err2)];
    return promiseUtils.anyPromise(testPromiseArray).should.eventually.be.rejectedWith([err1, err2]);
  });

  it('3 failures', () => {
    const err1 = new Error('Error 1');
    const err2 = new Error('Error 2');
    const err3 = new Error('Error 3');
    const testPromiseArray = [Promise.reject(err1), Promise.reject(err2), Promise.reject(err3)];
    return promiseUtils.anyPromise(testPromiseArray).should.eventually.be.rejectedWith([err1, err2, err3]);
  });

  it('2 failures and 1 successful', () => {
    const err1 = new Error('Error 1');
    const err2 = new Error('Error 2');
    const testPromiseArray = [Promise.reject(err1), Promise.reject(err2), Promise.resolve(true)];
    return promiseUtils.anyPromise(testPromiseArray).should.eventually.be.equal(true);
  });
});
