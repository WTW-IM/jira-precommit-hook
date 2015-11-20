import _ from 'lodash';

function createIssueLinks(direction, parentKey, parentType, linkType) {
  return {
    'fields': {
      'issuelinks': [{
        'type': {
          'name': linkType
        },
        [direction]: {
          'key': parentKey,
          'fields': {
            'issuetype': {
              'name': parentType
            }
          }
        }
      }]
    }
  };
}

export default function createTestIssue(key, type, color, parentKey, parentType, linkType) {
  let baseIssue = {
    'key': key,
    'fields': {
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
      return _.merge(baseIssue, createIssueLinks('inwardIssue', parentKey, parentType, linkType));
    case 'Story':
      if(parentType === 'Epic') {
        return _.merge(baseIssue, {
          'fields': {
            'customfield_10805': parentKey
          }
        });
      }
      return _.merge(baseIssue, createIssueLinks('outwardIssue', parentKey, parentType, linkType));
    case 'Sub-task':
    case 'Feature Defect':
      return _.merge(baseIssue, {
        'fields': {
          'parent': {
            'key': parentKey
          }
        }
      });
    case 'Deployment Task':
    case 'Initiative':
    case 'Bug':
    case 'Unknown':
    case 'Maintenance Task':
    // This is old??
    case 'MT':
    case 'Task':
      return baseIssue;
  }
}
