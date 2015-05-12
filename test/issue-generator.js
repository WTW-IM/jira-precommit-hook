export default function createTestIssue(key, type, color, parentKey, parentType) {
  switch(type) {
    case 'Initiative':
      return {
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
    case 'Epic':
      return {
        'fields': {
          'key': key,
          'status': {
            'statusCategory': {
              'colorName': color
            }
          },
          'issuetype': {
            'name': type
          },
      'issuelinks': [
          {
            'inwardIssue': {
              'key': parentKey
              }
            }
        ]
      }
      };
    case 'Story':
      if(parentKey === 'Epic') {
        return {
          'fields': {
            'key': key,
            'status': {
              'statusCategory': {
                'colorName': color
              }
            },
            'issuetype': {
              'name': color
            },
            'customfield_10805': parentKey
          }
        };
      }
      return {
        'fields': {
          'key': key,
          'status': {
            'statusCategory': {
              'colorName': color
            }
          },
          'issuetype': {
            'name': type
          },
          'issuelinks': [
          {
            'outwardIssue': {
              'key': parentKey
              }
            }
        ]
      }
    };
    case 'Sub-task':
      return {
        'fields': {
          'key': key,
          'parent': {
            'key': parentKey
          },
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
    case 'Bug':
      return {
        'fields': {
          'key': key,
          'status': {
            'statusCategory': {
              'colorName': color
            }
          }
        }
      };
    case 'MT':
      return {
        'fields': {
          'key': key,
          'status': {
            'statusCategory': {
              'colorName': color
            }
          }
        }
      };
  }
}
