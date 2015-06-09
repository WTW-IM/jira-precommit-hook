jira-precommit-hook
-------------------

Goals:

- Commit hook script contains the bare bones needed to call into this library.
  We may want to investigate use of existing
  [pre-commit](https://www.npmjs.com/package/pre-commit) module.


# NOTICE

Currently only configured for read-only access to JIRA.

# Project Configuration

**DESCRIPTION**

In order to communicate with your JIRA server, a .jirarc file needs to be placed in the root of the repo.

```json
{
	"projectName": "<Name of JIRA project - REQUIRED>",
	"host":"<URL location of JIRA project - REQUIRED>",
	"protocol":"[default:http|https]",
	"port": default:80,
	"version": default:2,
	"verbose": default:false,
	"strictSSL": default:true
}
```

**INSTALLATION**

To install, run the following with [npm](https://www.npmjs.com):
```
npm install jira-precommit-hook
```

**SYMLINK DIRECTORY NOTICE**

If the hooks directory in your .git folder is symlinked, the module will be unable to find it. To avoid this, do not symlink your hooks folder inside of your project's git directory.

# Making JIRA Commits

_In order to make a successful commit with the precommit hook, **ALL** issues being committed must meet the following requirements:_

- There must be at least one issue in the commit message
- All committed issues must exist in the project designated in the .jirarc


_At **least one** issue being committed must meet the following requirements:_
- The issue must be open for commits
- The parents of the issue must also be open for commits
  - The issue must lead up to an initiative
- The issue must not be an initiative, epic, nor a deployment task
