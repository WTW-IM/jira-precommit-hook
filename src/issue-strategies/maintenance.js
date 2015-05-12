export function matches(issueType) {
  return issueType === 'Maintenance Task';
}

export function apply(issueKey, jiraClientAPI) {
  return jiraClientAPI.findIssue(issueKey)
  .then(content =>
    content !== null &&
    content.fields.status.statusCategory.colorName === 'yellow'
  );
}
