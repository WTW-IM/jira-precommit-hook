import * as storyStrat from '../../src/issue-strategies/story.js';
import DummyJira from '../dummy-jira.js';

let dummyJira = new DummyJira();

describe('Story/Sub-task Strategy Apply Tests', () => {
  describe('Okay to commit against', () => {
    it('Sub-task is yellow and all the parents up to the initiative are yellow', () =>
      storyStrat.apply(dummyJira.issues.TW102, dummyJira).should.eventually.equal(true)
    );

    it('Story is yellow and all the parents up the initiative are yellow', () =>
      storyStrat.apply(dummyJira.issues.TW101, dummyJira).should.eventually.equal(true)
    );

    it('Story is yellow and parent is an initiative which is also yellow', () =>
      storyStrat.apply(dummyJira.issues.TW103, dummyJira).should.eventually.equal(true)
    );
  });

  describe('Should not be able to commit against', () => {
    it('Sub-task not yellow', () =>
      storyStrat.apply(dummyJira.issues.TW204, dummyJira).should.eventually.be.rejectedWith(Error)
    );

    it('Sub-task is yellow, but the story is not', () =>
      storyStrat.apply(dummyJira.issues.TW203, dummyJira).should.eventually.be.rejectedWith(Error)
    );

    it('Sub-task is yellow, but the epic is not', () =>
      storyStrat.apply(dummyJira.issues.TW206, dummyJira).should.eventually.be.rejectedWith(Error)
    );

    it('Sub-task is yellow, but the initiative is not', () =>
      storyStrat.apply(dummyJira.issues.TW207, dummyJira).should.eventually.be.rejectedWith(Error)
    );

    it('Story not yellow', () =>
      storyStrat.apply(dummyJira.issues.TW202, dummyJira).should.eventually.be.rejectedWith(Error)
    );

    it('Story is yellow, but the epic is not', () =>
      storyStrat.apply(dummyJira.issues.TW201, dummyJira).should.eventually.be.rejectedWith(Error)
    );

    it('Story is yellow, but the initiative is not', () =>
      storyStrat.apply(dummyJira.issues.TW205, dummyJira).should.eventually.be.rejectedWith(Error)
    );
  });
});
