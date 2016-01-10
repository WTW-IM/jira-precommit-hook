export default async function apply(issues, jiraClientAPI) {
  const issueMap = issues.map(issue => {
    return jiraClientAPI.findIssue(issue);
  });

  // On error, throws: "Error: Issue {key} does not exist."
  await Promise.all(issueMap);

  return true;
}
