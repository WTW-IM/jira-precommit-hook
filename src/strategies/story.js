function isParentInitiativeApproved(issueKey) {
  let issueJSON = retriveIssueJSON(issueKey);

  if(issueJSON.fields.issuetype.name === 'Initiative') {
    if(issueJSON.fields.status.name === 'Approved') {
      return true;
    } else {
      return false;
    }
  } else if(issueJSON.fields.issuetype.name === 'Epic') {
    for(let i in issueJSON.fields.issuelinks) {
      if(i.inwardIssue.fields.issuetype === 'Initiative') {
        return isParentInitiativeApproved(i.inwardIssue.key);
      }
    }
  } else if(issueJSON.fields.issuetype.name === 'Story') {
    return isParentInitiativeApproved(issueJSON.fields.customfield_10805); //Links to the epic //Hardcoded for now since it is a customfield
  } else if(issueJSON.fields.issuetype.name === 'Sub-task') {
    return isParentInitiativeApproved(issueJSON.fields.parent.key);
  }
}

export function matches(issueType) {
  return issueType === 'Story' || issueType === 'Sub-task';
}

export function apply(issueKey) {
  let issueJSON = retriveIssueJSON(issueKey);
  let bool = issueJSON !== null;
  bool = bool && issueJSON.fields.status.name ==='Open';
  bool = bool && isParentInitiativeApproved(issueKey);

  if(bool) {

  }
}
