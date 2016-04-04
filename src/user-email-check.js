import chalk from 'chalk';
import { exec } from 'child-process-promise';

export function isWorkEmail(email) {
  return /@(extendhealth|towerswatson|willistowerswatson)\.com/i.test(email);
}

export default async function checkUserEmail() {
  const { stdout } = await exec('git config --get user.email');
  const email = stdout.trim();
  if (!isWorkEmail(email)) {
    const message =
      chalk.yellow(`WARNING: The email address you have configured in Git, '${email}', is not ` +
                   'your work email address. To configure your work email address for this ' +
                   'repo run:\n\n') +
      chalk.green('> git config user.email "<Work Email Here>"') +
      chalk.yellow('\n\nTo configure your work email address for all repos run: (You may ' +
                   'want to remember to use your personal email address for any open source ' +
                 'repos with this option, so choose the option that works best for you.)\n\n') +
      chalk.green('> git config user.email "<Work Email Here>" --global\n');

    console.log(message);
  }
}
