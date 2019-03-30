import _ from 'lodash';

export async function findProjectKey(jiraClient) {
  const projects = await jiraClient.listProjects();

  const foundConfiguredProject =
    _.find(projects, project => project.name === jiraClient.projectName);

  console.log(`PROJECT NAME=`, jiraClient.projectName);
  console.log('PROJECT KEYS', projects.map(x => x.key));
  console.log('PROJECT NAMES', projects.map(x => x.name));

  if (foundConfiguredProject === null) {
    const errorMsg =
      `Configured project, '${foundConfiguredProject}',
      was not found on server, '${jiraClient.host}'.`;

    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  return foundConfiguredProject.key;
}

export const getEpicLinkField = _.memoize(
  async function getEpicLinkFieldActual(jiraClient) {
    const fields = await jiraClient.listFields();
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].name === 'Epic Link') {
        return fields[i].id;
      }
    }
    throw new Error('Cannot find Epic Link Field.');
  },
  (jiraClient) => jiraClient.host
);

export function findIssueLinkParentKey(issue) {
  let result = null;
  issue.fields.issuelinks.forEach(issueLink => {
    if (issueLink.type.name !== 'Relates') {
      return;
    }

    let linkDirection = null;

    if (issueLink.inwardIssue) {
      linkDirection = 'inwardIssue';
    } else if (issueLink.outwardIssue) {
      linkDirection = 'outwardIssue';
    }

    if (linkDirection && issueLink[linkDirection].fields.issuetype.name === 'Initiative') {
      result = issueLink[linkDirection].key;
    }
  });

  return result;
}

function handleSubtask(jiraClient, issue) {
  return jiraClient.findIssue(issue.fields.parent.key);
}

async function handleStory(jiraClient, issue) {
  if (issue.fields.issuelinks) {
    const parentKey = findIssueLinkParentKey(issue);

    if (parentKey) {
      return jiraClient.findIssue(parentKey);
    }
  }

  const linkField = await getEpicLinkField(jiraClient);
  const epicIssueNumber = issue.fields[linkField];

  if (!epicIssueNumber) {
    throw new Error(`${issue.key} does not have an associated parent Initiative or Epic.`);
  }

  return jiraClient.findIssue(issue.fields[linkField]);
}

function handleEpic(jiraClient, issue) {
  const parentKey = findIssueLinkParentKey(issue);

  if (!parentKey) {
    throw new Error(`Cannot find initiative from Epic ${issue.key} in issue links. ` +
                    "Initiative should be linked by 'relates to'.");
  }

  return jiraClient.findIssue(parentKey);
}
export const findParent = _.memoize(
  async function findParentActual(issue, jiraClient) {
    switch (issue.fields.issuetype.name) {
      case 'Sub-task':
      case 'Feature Defect':
        return handleSubtask(jiraClient, issue);
      case 'Story':
        return await handleStory(jiraClient, issue);
      case 'Epic':
        return handleEpic(jiraClient, issue);
      default:
        throw new Error(`${issue.fields.issuetype.name} should not have a parent.`);
    }
  },
  (issue) => JSON.stringify(issue)
);
