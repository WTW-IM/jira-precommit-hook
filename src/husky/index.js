#!/usr/bin/env node

const precommit = require('jira-precommit-hook/lib/precommit-entry');
const COMMIT_EDITMSG_FILE = process.env.GIT_PARAMS || process.env.HUSKY_GIT_PARAMS;

precommit.precommit(COMMIT_EDITMSG_FILE)
  .then((exitCode) => {
    process.exit(exitCode);
  });
