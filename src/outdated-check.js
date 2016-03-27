import chalk from 'chalk';
import pkg from '../package.json';
import updateNotifier from 'update-notifier';

export default async function checkOutdated() {
  const notifier = updateNotifier({ pkg });

  if (notifier.update) {
    const { current, latest } = notifier.update;
    const warning = chalk.yellow(`WARNING: You are using version ${current} of the ` +
                               `jira-precommit-hook. However, version ${latest} has been ` +
                               'released. To update run:');
    const arrow = chalk.grey('\n> ');
    const updateCommand = chalk.green(`npm install ${pkg.name}@${latest} --save-dev\n`);
    console.warn(warning + arrow + updateCommand);
  }
}
