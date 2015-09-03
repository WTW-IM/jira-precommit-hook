import * as jiraOperations from '../jira-operations.js';

export function apply(issue, jiraClientAPI) {
  if(issue === null || issue.fields.status.statusCategory.colorName !== 'yellow') {
    return Promise.reject(new Error(`Issue ${issue.key} is not open to commit against`));
  }
  if(issue.fields.issuelinks !== undefined)
  {
    console.log('I got issue links yo'.cyan);
    return jiraOperations.findParent(issue, jiraClientAPI).then((parent)=>
    {
      console.log('Looking for parent'.cyan);
      console.log(JSON.stringify(parent,null,2));
      return parent.fields.status.statusCategory.colorName === 'yellow' ? Promise.resolve(true) :Promise.reject(new Error(`Cannot commit issue ${issue.key} because parent issue ${parent.key} is not available to commit against.`)); 
    });   
  }


  return Promise.resolve(true);
}
