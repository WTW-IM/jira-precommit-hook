export function matches(issueType) {
  return issueType === 'Bug';
}

export function apply(issueKey) {
  retrieveIssue(issueKey)
  .then(content =>
      content !== null &&
      content.fields.status.statusCategory.colorName === 'yellow'
  );
}
