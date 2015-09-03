import * as dispatcherStrat from '../../src/issue-strategies/dispatcher.js';
import DummyJira from '../dummy-jira.js';

describe('Dispatcher/Subtask Strategy Apply Tests', () =>
{
  let dummyJira;

  beforeEach(()=> {
    dummyJira = new DummyJira();
  });
  describe('Not ok to commit against', () => {
    it('should fail because you can\'t commit against dispatcher', ()=>
    dispatcherStrat.apply(dummyJira.issues.Dispatcher1, dummyJira).should.eventually.be.rejectedWith(Error, /Cannot commit against a Dispatcher/));
  });
});

