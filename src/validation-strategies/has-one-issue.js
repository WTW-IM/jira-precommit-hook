export default function apply(issues, jiraClientAPI) {
  if (issues.length === 0) {
    throw new Error('Must commit against at least one issue.');
  }

  return true;
}
