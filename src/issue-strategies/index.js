import * as bugMtStrat from './bug-maintenance.js';
import * as initStrat from './initiative.js';
import * as epicStrat from './epic.js';
import * as storyStrat from './story.js';
import * as taskStrat from './task.js';

export default {
  Initiative: initStrat,
  Epic: epicStrat,
  Story: storyStrat,
  'Sub-task': storyStrat,
  'Maintenance Task': bugMtStrat,
  'Deployment Task': bugMtStrat,
  'Feature Defect': storyStrat,
  Bug: bugMtStrat,
  Task: taskStrat
};
