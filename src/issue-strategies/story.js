function getParentInitiative(content, jiraClientAPI) {
  if(content.fields.status.statusCategory.colorName !== 'yellow') {
    return false;
  }

  if(content.fields.issuetype.name === 'Epic') {
    for(let i in content.fields.issuelinks) {
      if(content.fields.issuelinks[i].inwardIssue.fields.issuetype.name === 'Initiative') {
        return isParentInitiativeApproved(content.fields.issuelinks[i].inwardIssue.key);
      }
    }
    return false;
  } else if(content.fields.issuetype.name === 'Story') {
    return isParentInitiativeApproved(content.fields.customfield_10805); //Links to the epic //Hardcoded for now since it is a customfield
  } else if(content.fields.issuetype.name === 'Sub-task') {
    return isParentInitiativeApproved(content.fields.parent.key);
  }
}

function isParentInitiativeApproved(issueKey, jiraClientAPI) {
  return jiraClientAPI.findIssue(issueKey)
  .then(content => {
    if(content.fields.issuetype.name === 'Initiative') {
      return content.fields.status.statusCategory.colorName === 'yellow';
    }
    return getParentInitiative(content);
  });
}

export function matches(issueType) {
  return issueType === 'Story' || issueType === 'Sub-task';
}

export function apply(issueKey, jiraClientAPI) {
  return jiraClientAPI.findIssue(issueKey)
    .then(content => {
      if(content === null || content.fields.status.statusCategory.colorName !== 'yellow') {
        return false;
      }
      return isParentInitiativeApproved(issueKey, jiraClientAPI);
    });
}
