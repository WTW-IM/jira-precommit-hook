import _ from 'lodash';

export function getEpicLinkField(jiraClient) {
  return jiraClient.listFields()
    .then(fields => {
      for(let i = 0; i < fields.length; i++) {
        if(fields[i].name === 'Epic Link') {
          return fields[i].id;
        }
      }

      return Promise.reject('Cannot find Epic Link Field.');
    });
}

export function findParent(issue, jiraClient) {
  switch(issue.fields.issuetype.name) {
    case 'Sub-task':
      return jiraClient.findIssue(issue.fields.parent.key);

    case 'Story':
      if(issue.fields.issuelinks) {
        for(let i = 0; i < issue.fields.issuelinks.length; i++) {
          let outwardIssue = issue.fields.issuelinks[i].outwardIssue;

          if(outwardIssue.fields.issuetype.name === 'Initiative') {
            return jiraClient.findIssue(outwardIssue.key);
          }
        }
      }

      return getEpicLinkField(jiraClient)
        .then(linkField => jiraClient.findIssue(issue.fields[linkField]));

    case 'Epic':
      if(issue.fields.issuelinks) {
        for(let i = 0; i < issue.fields.issuelinks.length; i++) {
          let inwardIssue = issue.fields.issuelinks[i].inwardIssue;

          if(inwardIssue.fields.issuetype.name === 'Initiative') {
            return jiraClient.findIssue(inwardIssue.key);
          }
        }

        return Promise.reject('Cannot find parent from Epic.');
      }
      break;

      default:
        return Promise.reject(`${issue.fields.issuetype.name} should not have a parent.`);
  }
}
