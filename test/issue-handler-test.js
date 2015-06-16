import * as issueHandler from '../src/issue-handler.js';
import DummyJira from './dummy-jira.js';

let dummyJira = new DummyJira();

describe('Issue Handler Test', () => {

  it('Empty issues array', done => {
    let testIssueArr = [];
    issueHandler.issueStrategizer(testIssueArr, dummyJira).should.eventually.be.rejectedWith(Error).notify(done);
  });

  it('1 good issue', done => {
    let testIssueArr = ['SubTask1'];
    issueHandler.issueStrategizer(testIssueArr, dummyJira).should.eventually.equal(true).notify(done);
  });

  it('1 bad issue', done => {
    let testIssueArr = ['SubTask4'];
    issueHandler.issueStrategizer(testIssueArr, dummyJira).should.eventually.be.rejectedWith(Error).notify(done);
  });

  it('1 non-existent issue', done => {
    let testIssueArr = ['TW500'];
    issueHandler.issueStrategizer(testIssueArr, dummyJira).should.eventually.be.rejectedWith(Error).notify(done);
  });

  it('1 non-existent issue and 1 good issue', done => {
    let testIssueArr = ['SubTask1', 'TW500'];
    issueHandler.issueStrategizer(testIssueArr, dummyJira).should.eventually.be.rejectedWith(Error).notify(done);
  });

  it('1 good issue and 1 non-existent issue', done => {
    let testIssueArr = ['TW502', 'SubTask1'];
    issueHandler.issueStrategizer(testIssueArr, dummyJira).should.eventually.be.rejectedWith(Error).notify(done);
  });

  it('2 bad issues', done => {
    let testIssueArr = ['Story6', 'SubTask3'];
    issueHandler.issueStrategizer(testIssueArr, dummyJira).should.eventually.be.rejectedWith([new Error(), new Error()]).notify(done);
  });

  it('2 bad issue and 1 good issue', done => {
    let testIssueArr = ['Story6', 'SubTask3', 'Story1'];
    issueHandler.issueStrategizer(testIssueArr, dummyJira).should.eventually.equal(true).notify(done);
  });
});
