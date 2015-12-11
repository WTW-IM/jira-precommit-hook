import * as issueHandler from '../src/issue-handler.js';
import DummyJira from './dummy-jira.js';

const dummyJira = new DummyJira();

describe('Issue Handler Test', () => {
  it('Empty issues array', done => {
    const testIssueArr = [];
    issueHandler.issueStrategizer(testIssueArr, dummyJira).should.eventually.be.rejectedWith(Error).notify(done);
  });

  it('1 good issue', done => {
    const testIssueArr = ['SubTask1'];
    issueHandler.issueStrategizer(testIssueArr, dummyJira).should.eventually.equal(true).notify(done);
  });

  it('1 bad issue', done => {
    const testIssueArr = ['SubTask8'];
    issueHandler.issueStrategizer(testIssueArr, dummyJira).should.eventually.be.rejectedWith(Error).notify(done);
  });

  it('1 non-existent issue', done => {
    const testIssueArr = ['TW500'];
    issueHandler.issueStrategizer(testIssueArr, dummyJira).should.eventually.be.rejectedWith(Error).notify(done);
  });

  it('1 non-existent issue and 1 good issue', done => {
    const testIssueArr = ['SubTask1', 'TW500'];
    issueHandler.issueStrategizer(testIssueArr, dummyJira).should.eventually.be.rejectedWith(Error).notify(done);
  });

  it('1 good issue and 1 non-existent issue', done => {
    const testIssueArr = ['TW502', 'SubTask1'];
    issueHandler.issueStrategizer(testIssueArr, dummyJira).should.eventually.be.rejectedWith(Error).notify(done);
  });

  it('2 bad issues', done => {
    const testIssueArr = ['Story6', 'SubTask7'];
    issueHandler.issueStrategizer(testIssueArr, dummyJira).should.eventually.be.rejectedWith([new Error(), new Error()]).notify(done);
  });

  it('2 bad issue and 1 good issue', done => {
    const testIssueArr = ['Story6', 'SubTask7', 'Story1'];
    issueHandler.issueStrategizer(testIssueArr, dummyJira).should.eventually.equal(true).notify(done);
  });
});
