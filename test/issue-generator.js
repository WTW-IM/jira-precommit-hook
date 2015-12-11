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
  const baseIssue = {
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

  switch (type) {
  case 'Epic':
    return _.merge(baseIssue, createIssueLinks('inwardIssue', parentKey, parentType, linkType));
  case 'Story':
    if (parentType === 'Epic') {
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
  default:
    return baseIssue;
  }
}
