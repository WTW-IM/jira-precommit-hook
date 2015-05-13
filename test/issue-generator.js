import _ from 'lodash';

function createIssueLinks(direction, parentKey, parentType) {
  return {
    'fields': {
      'issuelinks': [{
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
      return _.merge(baseIssue, createIssueLinks('inwardIssue', parentKey, parentType));
    case 'Story':
      if(parentType === 'Epic') {
        return _.merge(baseIssue, {
          'fields': {
            'customfield_10805': parentKey
          }
        });
      }
      return _.merge(baseIssue, createIssueLinks('outwardIssue', parentKey, parentType));
    case 'Sub-task':
      return _.merge(baseIssue, {
        'fields': {
          'parent': {
            'key': parentKey
          }
        }
      });
    case 'Initiative':
    case 'Bug':
    case 'MT':
      return baseIssue;
  }
}
