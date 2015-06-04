import 'colors';

function withinActiveSprint(issue, jiraClientAPI) {
  let today = new Date();

  return jiraClientAPI.findIssue(issue)
    .then(contents => {
      let fields = contents.fields.customfield_10804;

      if(fields !== undefined) {
        fields = fields[0];
        let start = fields.match(RegExp('startDate=([0-9\-]+)', 'g'));
        let end = fields.match(RegExp('endDate=([0-9\-]+)', 'g'));

        let startDate = new Date(start);
        let endDate = new Date(end);

        console.log(`START DATE: ${start}`);
        console.log(`END DATE: ${end}`);

        if(today < startDate || today > endDate) {
          console.log(`Issue ${contents.key} is not in this Active Sprint.`.yellow);
        }
      }
      return Promise.resolve(true);
    });
}

export default function apply(issues, jiraClientAPI) {
  return Promise.all(issues.map(issue =>
    withinActiveSprint(issue, jiraClientAPI)
  ));
}
