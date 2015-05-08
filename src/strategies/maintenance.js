export function matches(issueType) {
  return issueType === 'Maintenance Task';
}

export function apply(issueKey) {
  retrieveIssue(issueKey)
  .then(content =>
    content !== null &&
    content.fields.status.statusCategory.colorName === 'yellow'
  );
}
