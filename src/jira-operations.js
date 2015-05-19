import _ from 'lodash';

export function findProjectKey(jiraClient) {
  return jiraClient.listProjects()
    .then(projects => {
      let index = _.findIndex(projects,
        project => project.name === jiraClient.projectName);

      return index >= 0 ? projects[index].key : null;
    });
}

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

function findIssueLinkParentKey(issue, linkDirection) {
  let index = _.findIndex(issue.fields.issuelinks,
    issueLink => issueLink[linkDirection].fields.issuetype.name === 'Initiative');

  return index >= 0 ? issue.fields.issuelinks[index][linkDirection].key : null;
}

export function findParent(issue, jiraClient) {
  switch(issue.fields.issuetype.name) {
    case 'Sub-task':
      return jiraClient.findIssue(issue.fields.parent.key);

    case 'Story':
      if(issue.fields.issuelinks) {
        let parentKey = findIssueLinkParentKey(issue, 'outwardIssue');

        if(parentKey) {
          return jiraClient.findIssue(parentKey);
        }
      }

      return getEpicLinkField(jiraClient)
        .then(linkField => jiraClient.findIssue(issue.fields[linkField]));

    case 'Epic':
      let parentKey = findIssueLinkParentKey(issue, 'inwardIssue');

      return parentKey ? jiraClient.findIssue(parentKey) : Promise.reject(`Cannot find parent from Epic ${issue.key}`);

    default:
        return Promise.reject(`${issue.fields.issuetype.name} should not have a parent.`);
  }
}
