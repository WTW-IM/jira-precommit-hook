export function apply(issue, jiraClientAPI) {
  throw new Error(
    `Cannot commit against ${issue.key}. It is of type ${issue.fields.issuetype.name}.`
  );
}
