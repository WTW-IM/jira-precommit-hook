import issueGenerator from './issue-generator.js';

class DummyJira {
  constructor() {
    this.host = 'jira.host.com';
    this.projectName = 'Last Three';

    this.issues = {
      TW1: issueGenerator('TW1', 'Bug', 'yellow'),
      TW2: issueGenerator('TW2', 'Bug', 'green'),
      TW3: issueGenerator('TW3', 'MT', 'yellow'),
      TW4: issueGenerator('TW4', 'MT', 'green'),
      TW5: issueGenerator('TW5', 'Epic', 'yellow'),
      TW6: issueGenerator('TW6', 'Initiative', 'yellow'),
      TW7: issueGenerator('TW7', 'Epic', 'green'),
      TW8: issueGenerator('TW8', 'Story', 'green'),
      TW9: issueGenerator('TW9', 'MT', 'yellow'),
      TW10: issueGenerator('TW10', 'Sub-task', 'green'),
      TW11: issueGenerator('TW11', 'Task', 'yellow'),
      PM100: issueGenerator('PM100', 'Initiative', 'yellow'),
      TW100: issueGenerator('TW100', 'Epic', 'yellow', 'PM100', 'Initiative', 'Relates'),
      TW101: issueGenerator('TW101', 'Story', 'yellow', 'TW100', 'Epic'),
      TW102: issueGenerator('TW102', 'Sub-task', 'yellow', 'TW101'),
      TW103: issueGenerator('TW103', 'Story', 'yellow', 'PM100', 'Initiative', 'Relates'),
      PM200: issueGenerator('PM200', 'Initiative', 'red'),
      TW200: issueGenerator('TW200', 'Epic', 'red', 'PM100', 'Initiative', 'Relates'),
      TW201: issueGenerator('TW201', 'Story', 'yellow', 'TW200', 'Epic'),
      TW202: issueGenerator('TW202', 'Story', 'red', 'TW200', 'Epic'),
      TW203: issueGenerator('TW203', 'Sub-task', 'yellow', 'TW202'),
      TW204: issueGenerator('TW204', 'Sub-task', 'red', 'TW202'),
      TW205: issueGenerator('TW205', 'Story', 'yellow', 'PM200', 'Initiative', 'Relates'),
      TW206: issueGenerator('TW206', 'Sub-task', 'yellow', 'TW201'),
      TW207: issueGenerator('TW207', 'Sub-task', 'yellow', 'TW205'),
      'WHP-9996': issueGenerator('WHP-9996', 'Feature Defect', 'yellow', 'WHP-9993', 'Story'),
      'WHP-9997': issueGenerator('WHP-9997', 'Sub-task', 'yellow', 'WHP-9993', 'Story'),
      'WHP-9995': issueGenerator('WHP-9995', 'Sub-task', 'yellow', 'WHP-9994', 'Story'),
      'WHP-9994': issueGenerator('WHP-9994', 'Story', 'yellow', 'WHP-9992', 'Epic'),
      'WHP-9993': issueGenerator('WHP-9993', 'Story', 'yellow', 'PM100', 'Initiative', 'Relates'),
      'WHP-9992': issueGenerator('WHP-9992', 'Epic', 'yellow', 'PM100', 'Initiative', 'Relates'),
      'WHP-9991': issueGenerator('WHP-9991', 'Epic', 'yellow'),
      'WHP-9999': issueGenerator('WHP-9999', 'Story', 'yellow', 'PM100', 'Initiative', 'Blocks')
    };

    this.fields = {
      'epicLink': [{
                'id': 'customfield_10805',
                'name': 'Epic Link'
              }],
      'noEpicLink': []
    };

    this.projects = [
      {
        'key': 'ABC',
        'name': 'First Three'
      },
      {
        'key': 'XYZ',
        'name': 'Last Three'
      }
    ];
  }

  findIssue(key) {
    if(this.issues[key] === undefined) {
      return Promise.reject(new Error(`Issue ${key} does not exist.`));
    }

    return Promise.resolve(this.issues[key]);
  }

  listFields() {
    return Promise.resolve(this.fields.epicLink);
  }

  listProjects() {
    return Promise.resolve(this.projects);
  }
}

export default DummyJira;
