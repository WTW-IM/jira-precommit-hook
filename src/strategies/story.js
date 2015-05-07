function getParentInitiative(issue) {
  if(issue.fields.issuetype.name === 'Epic') {
    for(let i in issue.fields.issuelinks) {
      if(i.inwardIssue.fields.issuetype === 'Initiative') {
        return isParentInitiativeApproved(i.inwardIssue.key);
      }
      return false;
    }
  } else if(issue.fields.issuetype.name === 'Story') {
    return isParentInitiativeApproved(issue.fields.customfield_10805); //Links to the epic //Hardcoded for now since it is a customfield
  } else if(issue.fields.issuetype.name === 'Sub-task') {
    return isParentInitiativeApproved(issue.fields.parent.key);
  }
}

function isParentInitiativeApproved(issueKey) {
  retrieveIssue(issueKey)
  .then(content => {
    if(content.fields.issueType.name === 'Initiative') {
      return content.fields.status.statusCategory.colorName === 'yellow';
    }
    return getParentInitiative(content);
  });
}

export function matches(issueType) {
  return issueType === 'Story' || issueType === 'Sub-task';
}

export function apply(issueKey) {
  retrieveIssue(issueKey)
    .then(content => {
      if(content === null || content.fields.status.statusCategory.colorName !== 'yellow') {
        return false;
      }
      return isParentInitiativeApproved(issueKey);
    });
}
