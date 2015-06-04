import allExistStrat from './all-issues-exist.js';
import oneStrat from './has-one-issue.js';
import validStrat from './one-valid-issue.js';
import activeSprintStrat from './in-active-sprint.js';

export default [
  oneStrat,
  allExistStrat,
  validStrat,
  activeSprintStrat
];
