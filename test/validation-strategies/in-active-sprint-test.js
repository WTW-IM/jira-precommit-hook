import * as inActive from '../../src/validation-strategies/in-active-sprint';
import * as dateOperations from '../../src/date-operations';
import DummyJira from '../dummy-jira';

let dummyJira = new DummyJira();

describe('Verify active sprint tests', () => {
  beforeEach(() => {
    sinon.stub(dummyJira, 'listFields', function() {
      let customFieldJSON = [{
        'id': 'customfield_10804',
        'name': [
          'sprint1:[startDate=2015-05-20T09:00:57.130-06:00,endDate=2015-05-27T17:00:00.000-06:00]'
        ]
      }];
      return Promise.resolve(customFieldJSON);
    });
  });

  afterEach(() => {
    dateOperations.getDate.restore();
    dummyJira.listFields.restore();
  });

  it('Valid date', () => {
    sinon.stub(dateOperations, 'getDate', () => {
      return new Date('2015-05-22').getTime();
    });
    let testIssues = ['TW1'];
    return inActive.withinActiveSprint(testIssues, dummyJira).should.eventually.eql(true);
  });

  it('Before start', () => {
    sinon.stub(dateOperations, 'getDate', () => {
      return new Date('2015-05-18').getTime();
    });
    let testIssues = ['TW1'];
    return inActive.withinActiveSprint(testIssues, dummyJira).should.eventually.equal(true);
  });

  it('After end', () => {
    sinon.stub(dateOperations, 'getDate', () => {
      return new Date('2015-05-29').getTime();
    });
    let testIssues = ['TW1'];
    return inActive.withinActiveSprint(testIssues, dummyJira).should.eventually.equal(true);
  });
});
