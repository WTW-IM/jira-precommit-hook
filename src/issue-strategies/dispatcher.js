import * as jiraOperations from '../jira-operations.js';

export function apply(issue, jiraClientAPI)
{
	return Promise.reject(new Error(`Cannot commit against a Dispatcher`));
}
