export function matches(issueType) {
  return issueType === 'Maintenance Task';
}

export function apply(issueKey) {
  retrieveIssue(issueKey)
  .then(content => {
    if(content === null || content.fields.status.statusCategory.colorName !== 'yellow') {
      return false;
    }
    return true;
  });
}
