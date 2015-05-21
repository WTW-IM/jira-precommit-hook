export default function apply(issues, jiraClientAPI) {
  let issueMap = issues.map(issue => {
    return jiraClientAPI.findIssue(issue);
  });

  return Promise.all(issueMap)
   .then(() => true);
}
