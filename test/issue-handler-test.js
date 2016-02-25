import * as issueHandler from '../src/issue-handler.js';
import DummyJira from './dummy-jira.js';

const dummyJira = new DummyJira();

describe('Issue Handler Test', () => {
  it('Empty issues array', done => {
    const testIssueArr = [];
    issueHandler.issueStrategizer(testIssueArr, dummyJira)
      .should.eventually.be.rejectedWith(Error, /Must commit against at least one issue/)
      .notify(done);
  });

  it('1 good issue', async function() {
    const testIssueArr = ['SubTask1'];
    const result = await issueHandler.issueStrategizer(testIssueArr, dummyJira);
    result.should.equal(true);
  });

  it('1 bad issue', done => {
    const testIssueArr = ['SubTask8'];
    issueHandler.issueStrategizer(testIssueArr, dummyJira)
      .should.eventually.be.rejectedWith(Error,
        /Cannot commit issue SubTask8 because parent issue I3 is not available to commit/)
      .notify(done);
  });

  it('1 non-existent issue', done => {
    const testIssueArr = ['TW500'];
    issueHandler.issueStrategizer(testIssueArr, dummyJira)
      .should.eventually.be.rejectedWith(Error, /Issue TW500 does not exist/)
      .notify(done);
  });

  it('1 non-existent issue and 1 good issue', done => {
    const testIssueArr = ['SubTask1', 'TW500'];
    issueHandler.issueStrategizer(testIssueArr, dummyJira)
      .should.eventually.be.rejectedWith(Error, /Issue TW500 does not exist/)
      .notify(done);
  });

  it('1 good issue and 1 non-existent issue', done => {
    const testIssueArr = ['TW502', 'SubTask1'];
    issueHandler.issueStrategizer(testIssueArr, dummyJira)
      .should.eventually.be.rejectedWith(Error, /Issue TW502 does not exist/)
      .notify(done);
  });

  it('2 bad issues', async function() {
    const testIssueArr = ['Story6', 'SubTask7'];
    try {
      await issueHandler.issueStrategizer(testIssueArr, dummyJira);
    } catch (err) {
      err.should.be.an('Array');
      err.length.should.equal(2);
      err[0].message.should.match(/Issue Story6 is not open to commit against/);
      err[1].message.should.match(
        /Cannot commit issue SubTask7 because parent issue Epic4 is not available to commit/);
      return;
    }
    throw new Error('Should not hit this part of the test.');
  });

  it('2 bad issue and 1 good issue', done => {
    const testIssueArr = ['Story6', 'SubTask7', 'Story1'];
    issueHandler.issueStrategizer(testIssueArr, dummyJira)
      .should.eventually.equal(true)
      .notify(done);
  });
});
