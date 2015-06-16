import * as storyStrat from '../../src/issue-strategies/story.js';
import DummyJira from '../dummy-jira.js';

let dummyJira = new DummyJira();

describe('Story/Sub-task Strategy Apply Tests', () => {
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
  });

  describe('Should not be able to commit against', () => {
    it('Sub-task not yellow', () =>
      storyStrat.apply(dummyJira.issues.SubTask6, dummyJira)
        .should.eventually.be.rejectedWith(Error, /SubTask6 is not open to commit against/)
    );

    it('Sub-task is yellow, but the story is not', () =>
      storyStrat.apply(dummyJira.issues.SubTask5, dummyJira)
        .should.eventually.be.rejectedWith(Error, /Cannot commit.*SubTask5.*parent issue Story6/)
    );

    it('Sub-task is yellow, but the epic is not', () =>
      storyStrat.apply(dummyJira.issues.SubTask3, dummyJira)
        .should.eventually.be.rejectedWith(Error, /Cannot commit.*SubTask3.*parent issue Epic4/)
    );

    it('Sub-task is yellow, but the initiative is not', () =>
      storyStrat.apply(dummyJira.issues.SubTask4, dummyJira)
        .should.eventually.be.rejectedWith(Error, /Cannot commit.*SubTask4.*parent issue I3/)
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
