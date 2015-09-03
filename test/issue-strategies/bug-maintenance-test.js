import * as bugMtStrat from '../../src/issue-strategies/bug-maintenance.js';
import * as storySubTaskStrat from '../../src/issue-strategies/story.js';
import DummyJira from '../dummy-jira.js';

describe('Bug and Maintenance Strategy Apply Tests', () => {
  let dummyJira;

  beforeEach(function() {
    dummyJira = new DummyJira();
  });

  it('Bug open to commit against', () =>
    bugMtStrat.apply(dummyJira.issues.Bug1).should.eventually.eql(true)
  );

  it('Bug closed', () =>
    bugMtStrat.apply(dummyJira.issues.Bug2)
      .should.eventually.be.rejectedWith(Error, /Bug2 is not open to commit against/)
  );

  it('Bug Sub-Task, Sub-Task invalid', () =>
    storySubTaskStrat.apply(dummyJira.issues.SubTask14)
      .should.eventually.be.rejectedWith(Error, /SubTask14 is not open to commit against/)
  );

  it('Bug Sub-Task, Sub-Task valid, Bug Invalid', () =>
    storySubTaskStrat.apply(dummyJira.issues.SubTask11, dummyJira)
      .should.eventually.be.rejectedWith(Error, /Cannot commit.*SubTask11.*parent issue Bug2/)
  );

  it('Bug Sub-Task, Sub-Task valid, Bug Valid', () =>
    storySubTaskStrat.apply(dummyJira.issues.SubTask6, dummyJira)
      .should.eventually.eql(true)
  );

  it('Bug Linked Sub-Task, Sub-Task valid, BugValid', ()=>
      bugMtStrat.apply(dummyJira.issues.Bug3, dummyJira)
        .should.eventually.eql(true)
    );

  it('Bug Linked Epic, Bug Valid', ()=>
      bugMtStrat.apply(dummyJira.issues.Bug5,dummyJira)
        .should.eventually.eql(true)
    );
  it('Bug Linked Sub-Task, Sub-Task invalid, BugValid', ()=>
      bugMtStrat.apply(dummyJira.issues.Bug4, dummyJira)
        .should.eventually.be.rejectedWith(Error,/Cannot commit.*Bug4.*parent issue DispatcherLinkedSubTask5/)
    );
  it('Maintenance Task Linked Epic, Maintenance Task valid', ()=>
      bugMtStrat.apply(dummyJira.issues.MT7)
        .should.eventually.eql(true)
    );
  it('Maintenance Task open to commit against', () =>
    bugMtStrat.apply(dummyJira.issues.MT1).should.eventually.eql(true)
  );

  it('Maintenance Task closed', () =>
    bugMtStrat.apply(dummyJira.issues.MT2)
      .should.eventually.be.rejectedWith(Error, /MT2 is not open to commit against/)
  );

  it('Maintenance Sub-Task, Sub-Task invalid', () =>
    storySubTaskStrat.apply(dummyJira.issues.SubTask13)
      .should.eventually.be.rejectedWith(Error, /SubTask13 is not open to commit against/)
  );

  it('Maintenance Sub-Task, Sub-Task valid, Maintenance Invalid', () =>
    storySubTaskStrat.apply(dummyJira.issues.SubTask10, dummyJira)
      .should.eventually.be.rejectedWith(Error, /Cannot commit.*SubTask10.*parent issue MT2/)
  );

  it('Maintenance Sub-Task, Sub-Task valid, Maintenance Valid', () =>
    storySubTaskStrat.apply(dummyJira.issues.SubTask3, dummyJira)
      .should.eventually.eql(true)
  );

  it('Maintenance Sub-Task, Sub-Task valid, Maintenance Valid, With Valid Epic', () =>
    storySubTaskStrat.apply(dummyJira.issues.SubTask4, dummyJira)
      .should.eventually.eql(true)
  );

  it('Maintenance Sub-Task, Sub-Task valid, Maintenance Valid, With Invalid Epic', () =>
    storySubTaskStrat.apply(dummyJira.issues.SubTask5, dummyJira)
      .should.eventually.eql(true)
  );
});
