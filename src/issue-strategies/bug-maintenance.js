import {findParent} from '../jira-operations';

export function apply(issue, jiraClientAPI) {
  if(issue === null || issue.fields.status.statusCategory.colorName !== 'yellow') {
    return Promise.reject(new Error(`Issue ${issue.key} is not open to commit against`));
  }

  return findParent(issue, jiraClientAPI).then((parent)=>{
    if(!parent || parent.fields.status.statusCategory.colorName === 'yellow')
    {
      return Promise.resolve(true);
    }

    return Promise.reject(new Error(`Cannot commit issue ${issue.key} because parent issue ${parent.key} is not available to commit against.`));
  });
}
