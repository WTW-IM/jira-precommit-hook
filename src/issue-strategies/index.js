import * as bugMtStrat from './bug-maintenance.js';
import * as storyStrat from './story.js';
import * as notAllowedStrat from './not-allowed.js';

export default {
  Story: storyStrat,
  'Sub-task': storyStrat,
  'Maintenance Task': bugMtStrat,
  'Feature Defect': storyStrat,
  Bug: bugMtStrat,
  Unknown: notAllowedStrat
};
