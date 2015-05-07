export function matches(issueType) {
  return issueType === 'Bug';
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
