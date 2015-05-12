import _ from 'lodash';

export default function createTestIssue(key, type, color, parentKey, parentType) {
  let baseIssue = {
    'fields': {
      'key': key,
      'status': {
        'statusCategory': {
          'colorName': color
        }
      },
      'issuetype': {
        'name': type
      }
    }
  };

  switch(type) {
    case 'Epic':
      return _.merge(baseIssue, {
        'fields': {
          'issuelinks': [{
            'inwardIssue': {
              'key': parentKey
            }
          }]
        }
      });
    case 'Story':
      if(parentType === 'Epic') {
        return _.merge(baseIssue, {
          'fields': {
            'customfield_10805': parentKey
          }
        });
      }
      return _.merge(baseIssue, {
        'fields': {
          'issuelinks': [{
            'outwardIssue': {
              'key': parentKey
            }
          }]
        }
      });
    case 'Initiative':
    case 'Sub-task':
    case 'Bug':
    case 'MT':
      return baseIssue;
  }
}
