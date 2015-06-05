import _ from 'lodash';

export function findProjectKey(jiraClient) {
  return jiraClient.listProjects()
    .then(projects => _.find(projects,
        project => project.name === jiraClient.projectName).key);
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

export function findCustomField(jiraClient, customFieldId) {
  return jiraClient.listFields()
    .then(fields => {
      for(let i = 0; i < fields.length; i++) {
        if(fields[i].id === 'customfield_' + customFieldId) {
          return fields[i];
        }
      }
      return Promise.reject(new Error('Cannot find customfield_' + customFieldId));
    });
}

export function findIssueLinkParentKey(issue) {
  let result = null;
  issue.fields.issuelinks.forEach(issueLink => {
    if(issueLink.type.name !== 'Relates') {
      return;
    }

    let linkDirection = null;

    if(issueLink.inwardIssue) {
      linkDirection = 'inwardIssue';
    }
    else if(issueLink.outwardIssue) {
      linkDirection = 'outwardIssue';
    }

    if(linkDirection && issueLink[linkDirection].fields.issuetype.name === 'Initiative') {
      result = issueLink[linkDirection].key;
    }
  });
  return result;
}

export function findParent(issue, jiraClient) {
  switch(issue.fields.issuetype.name) {
    case 'Sub-task':
      return jiraClient.findIssue(issue.fields.parent.key);

    case 'Story':
      if(issue.fields.issuelinks) {
        let parentKey = findIssueLinkParentKey(issue);

        if(parentKey) {
          return jiraClient.findIssue(parentKey);
        }
      }

      return getEpicLinkField(jiraClient)
        .then(linkField => jiraClient.findIssue(issue.fields[linkField]));

    case 'Epic':
      let parentKey = findIssueLinkParentKey(issue);

      return parentKey ? jiraClient.findIssue(parentKey) : Promise.reject(`Cannot find parent from Epic ${issue.key}`);

    default:
        return Promise.reject(`${issue.fields.issuetype.name} should not have a parent.`);
  }
}
