export default function apply(issues, jiraClientAPI) {
  let issueMap = issues.map(issue => {
    return jiraClientAPI.findIssue(issue);
  });

  //On error, throws: "Error: Issue {key} does not exist."
  return Promise.all(issueMap)
    .then(() => true);
}
