import 'colors';
import pkg from '../package.json';
import updateNotifier from 'update-notifier';

export default async function checkOutdated() {
  const notifier = updateNotifier({ pkg });

  if (notifier.update) {
    const { current, latest } = notifier.update;
    let message = `WARNING: You are using version ${current} of the jira-precommit-hook. `.yellow;
    message += `However, version ${latest} has been released. To update run:`.yellow;
    message += '\n> '.grey + `npm install ${pkg.name}@${latest} --save-dev\n`.green;
    console.warn(message);
  }
}
