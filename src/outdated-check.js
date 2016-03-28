import chalk from 'chalk';
import { name, version } from '../package.json';
import request from 'request-promise';

export default async function checkOutdated() {
  const rawResponse = await request(`https://registry.npmjs.org/${name}/latest`);
  const latest = JSON.parse(rawResponse).version;

  if (version !== latest) {
    const warning = chalk.yellow(`WARNING: You are using version ${version} of the ` +
                                 `jira-precommit-hook. However, version ${latest} has been ` +
                                 'released. To update run:');
    const arrow = chalk.grey('\n> ');
    const updateCommand = chalk.green(`npm install ${name}@${latest} --save-dev\n`);
    console.warn(warning + arrow + updateCommand);
  }
}
