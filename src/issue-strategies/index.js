import * as bugMtStrat from './bug-maintenance.js';
import * as storyStrat from './story.js';
import * as notAllowedStrat from './not-allowed.js';

export default {
  Initiative: notAllowedStrat,
  Epic: notAllowedStrat,
  Story: storyStrat,
  'Sub-task': storyStrat,
  'Maintenance Task': bugMtStrat,
  'Deployment Task': notAllowedStrat,
  'Feature Defect': storyStrat,
  Bug: bugMtStrat,
  Task: notAllowedStrat,
  Unknown: notAllowedStrat
};
