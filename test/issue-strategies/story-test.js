import * as storyStrat from '../../src/issue-strategies/story.js';
import DummyJira from '../dummy-jira.js';


describe('Story/Sub-task Strategy Apply Tests', () => {
  let dummyJira;

  beforeEach(function() {
    dummyJira = new DummyJira();
  });
  describe('Okay to commit against', () => {
    it('Sub-task is yellow and all the parents up to the initiative are yellow', () =>
      storyStrat.apply(dummyJira.issues.SubTask1, dummyJira).should.eventually.equal(true)
    );
    it('Story is yellow and all the parents up the initiative are yellow', () =>
      storyStrat.apply(dummyJira.issues.Story1, dummyJira).should.eventually.equal(true)
    );

    it('Story is yellow and parent is an initiative which is also yellow', () =>
      storyStrat.apply(dummyJira.issues.Story2, dummyJira).should.eventually.equal(true)
    );

    it('Story is a child of a Sub-task from the dispatcher and all parents are yellow', ()=>
      storyStrat.apply(dummyJira.issues.LinkedStory1, dummyJira).should.eventually.equal(true)
    );

    it('Sub-task has a parent dispatcher, is linked to a story, and all parents are yellow', ()=>
      storyStrat.apply(dummyJira.issues.LinkedSubtask1, dummyJira).should.eventually.equal(true));
    it('Sub-task has a parent Maintainance task, and all parents are yellow', ()=>
      storyStrat.apply(dummyJira.issues.LinkedSubtask2, dummyJira).should.eventually.equal(true));
    it('Sub-task has a parent Bug, and all parents are yellow', ()=>
      storyStrat.apply(dummyJira.issues.LinkedSubtask3, dummyJira).should.eventually.equal(true));
    it('Sub-task has a parent Bug, with an epic link', ()=>
      storyStrat.apply(dummyJira.issues.BugSubtask2,dummyJira).should.eventually.equal(true));
    it('Sub-task has a parent Bug, with an epic link', ()=>
      storyStrat.apply(dummyJira.issues.BugSubtask2,dummyJira).should.eventually.equal(true));
  });

  describe('Should not be able to commit against', () => {
    it('Sub-task not yellow', () =>
      storyStrat.apply(dummyJira.issues.SubTask12, dummyJira)
        .should.eventually.be.rejectedWith(Error, /SubTask12 is not open to commit against/)
    );
    it('Subtask Task is yellow, but the Maintainance task parent is not', () =>
      storyStrat.apply(dummyJira.issues.MaintenanceSubtask1, dummyJira)
        .should.eventually.be.rejectedWith(Error, /Cannot commit.*MT5.*parent issue DispatcherLinkedSubTask4.*/)
      );

    it('Subtask Task is yellow, but the Bug task parent is not', () =>
      storyStrat.apply(dummyJira.issues.BugSubtask1, dummyJira)
        .should.eventually.be.rejectedWith(Error, /Cannot commit.*Bug4.*parent issue DispatcherLinkedSubTask5.*/)
    );

    it('Sub-task is yellow, but the story is not', () =>
      storyStrat.apply(dummyJira.issues.SubTask9, dummyJira)
        .should.eventually.be.rejectedWith(Error, /Cannot commit.*SubTask9.*parent issue Story6/)
    );

    it('Sub-task is yellow, but the epic is not', () =>
      storyStrat.apply(dummyJira.issues.SubTask7, dummyJira)
        .should.eventually.be.rejectedWith(Error, /Cannot commit.*SubTask7.*parent issue Epic4/)
    );

    it('Sub-task is yellow, but the initiative is not', () =>
      storyStrat.apply(dummyJira.issues.SubTask8, dummyJira)
        .should.eventually.be.rejectedWith(Error, /Cannot commit.*SubTask8.*parent issue I3/)
    );

    it('Story not yellow', () =>
      storyStrat.apply(dummyJira.issues.Story6, dummyJira)
        .should.eventually.be.rejectedWith(Error, /Story6 is not open to commit against/)
    );

    it('Story is yellow, but the epic is not', () =>
      storyStrat.apply(dummyJira.issues.Story3, dummyJira)
        .should.eventually.be.rejectedWith(Error, /Cannot commit.*Story3.*parent issue Epic4/)
    );

    it('Story is yellow, but the initiative is not', () =>
      storyStrat.apply(dummyJira.issues.Story4, dummyJira)
        .should.eventually.be.rejectedWith(Error, /Cannot commit.*Story4.*parent issue I3/)
    );
  });
});
