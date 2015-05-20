import createTestIssue from './issue-generator.js';

class DummyJira {
  constructor() {
    this.projectName = 'Last Three';

    this.issues = {
      'WHP-9995': createTestIssue('WHP-9995', 'Sub-task', 'yellow', 'WHP-9994', 'Story'),
      'WHP-9994': createTestIssue('WHP-9994', 'Story', 'yellow', 'WHP-9992', 'Epic'),
      'WHP-9993': createTestIssue('WHP-9993', 'Story', 'yellow', 'WHP-9990', 'Initiative'),
      'WHP-9992': createTestIssue('WHP-9992', 'Epic', 'yellow', 'WHP-9990', 'Initiative'),
      'WHP-9991': createTestIssue('WHP-9991', 'Epic', 'yellow'),
      'WHP-9990': createTestIssue('WHP-9990', 'Initiative', 'yellow')
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
