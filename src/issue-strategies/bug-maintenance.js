import * as jiraOperations from '../jira-operations.js';

export function apply(issue, jiraClientAPI) {
  if(issue === null || issue.fields.status.statusCategory.colorName !== 'yellow') {
    return Promise.reject(new Error(`Issue ${issue.key} is not open to commit against`));
  }

  if(issue.fields.issuelinks){
    return jiraOperations.findParent(issue, jiraClientAPI).then((parent)=>{
      if(!parent){
        return Promise.resolve(true);
      }
      return parent.fields.status.statusCategory.colorName === 'yellow' ? Promise.resolve(true) : Promise.reject(new Error(`Cannot commit issue ${issue.key} because parent issue ${parent.key} is not available to commit against.`));
    });
  }

  return Promise.resolve(true);
}
