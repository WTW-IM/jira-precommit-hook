import * as dateOperations from '../src/date-operations';

describe('Date operations tests', () => {
  it('Dates are equal', () => {
    let dateOne = new Date('2015-06-09');
    let dateTwo = new Date('2015-06-09');
    assert.ok(dateOperations.compareDates(dateOne, dateTwo) === 0);
  });

  it('First date is after second', () => {
    let dateOne = new Date('2015-06-09');
    let dateTwo = new Date('2015-06-08');
    assert.ok(dateOperations.compareDates(dateOne, dateTwo) > 0);
  });

  it('First date is before second', () => {
    let dateOne = new Date('2015-06-09');
    let dateTwo = new Date('2015-06-10');
    assert.ok(dateOperations.compareDates(dateOne, dateTwo) < 0);
  });
});
