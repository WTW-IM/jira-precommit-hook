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
      },
      'customfield_10804': [
        'sprint1:[startDate=\'2015-05-20T09:00:57.130-06:00\',endDate=\'2015-05-27T17:00:00.000-06:00\']'
      ]
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
