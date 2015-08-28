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

export function createIssueWithMutipleLinks(key, type, color, parents)
{
  let baseIssue = createBaseIssue(key,type,color);
  _.forEach(parents, function(n)
  {
    baseIssue = resolveIssue(baseIssue,type,n.key,n.type,n.linkType);
  });
  return baseIssue;
}

export {createIssueWithMutipleLinks as createIssueWithMutipleLinks};

export default function createTestIssue(key, type, color, parentKey, parentType, linkType) {

  let baseIssue = createBaseIssue(key,type,color);
  return resolveIssue(baseIssue, type, parentKey,parentType,linkType);
  
}

function createBaseIssue(key,type,color)
{
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
  return baseIssue;
}

function fullMerge(leftObject, rightObject)
{
  return _.merge(leftObject,rightObject,function(lhs,rhs)
  {
    if(_.isArray(lhs))
    {
      return lhs.concat(rhs);
    }
  });
}

function resolveIssue(baseIssue,type,parentKey,parentType,linkType)
{
  switch(type) {
    case 'Epic':
      return fullMerge(baseIssue, createIssueLinks('inwardIssue', parentKey, parentType, linkType));
    case 'Story':
      if(parentType === 'Epic') {
        
        return fullMerge(baseIssue, {
          'fields': {
            'customfield_10805': parentKey
          }
        });
      }
      return fullMerge(baseIssue, createIssueLinks('outwardIssue', parentKey, parentType, linkType));
    case 'Sub-task':
    return fullMerge(baseIssue, {
        'fields': {
          'parent': {
            'key': parentKey
          }
        }
      });
    case 'Feature Defect':
      return fullMerge(baseIssue, {
        'fields': {
          'parent': {
            'key': parentKey
          }
        }
      });

    case 'Dispatcher':
    case 'Initiative':
    case 'Bug':
    case 'Maintenance Task':
    // This is old??
    case 'MT':
    case 'Task':
      return baseIssue;
  }

}

