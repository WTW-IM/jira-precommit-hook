import * as jiraOperations from '../jira-operations.js';
import * as dateOperations from '../date-operations.js';
import * as _ from 'lodash';
import 'colors';

export function withinActiveSprint(issue, jiraClientAPI) {
  let commitTime = dateOperations.getDate();
  let issueKey;

  return jiraClientAPI.findIssue(issue)
    .then(contents => {
      issueKey = contents.key;
      return jiraOperations.findCustomField(jiraClientAPI, 10804);
    })
    .then(fieldJson => {
      if(fieldJson !== undefined) {
        let sprintBody = String(fieldJson.name);

        let index = sprintBody.indexOf('[');
        sprintBody = sprintBody.substring(index + 1);

        index = sprintBody.indexOf(']');
        sprintBody = sprintBody.substring(0, index);

        let sprintFields = sprintBody.split(',');
        for(let i = 0; i < sprintFields.length; i++) {
          sprintFields[i] = sprintFields[i].split('=');
        }
        let sprintDates = _.zipObject(sprintFields);

        let startDate = new Date(sprintDates.startDate);
        let endDate = new Date(sprintDates.endDate);

        let startDateComparison = dateOperations.compareDates(commitTime, startDate);
        let endDateComparison = dateOperations.compareDates(commitTime, endDate);

        if(startDateComparison < 0 || endDateComparison > 0) {
          console.log(`Issue ${issueKey} is not inside of the active sprint`.yellow);
        }
      }
      return Promise.resolve(true);
    })
    .catch(() => {
      // sprint field not in issue, prevents error from stopping commit
    });
}
