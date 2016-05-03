import config from '../config';
const command = 'jokes';

export default {
  command,
  async execute({ decision }) {
    if (decision === 'enable') {
      config.set('jokes', true);
      console.log('Jokes enabled!');
    } else if (decision === 'disable') {
      config.set('jokes', false);
      console.log('Jokes disabled!');
    } else if (decision === 'explicit') {
      config.set('explicit', true);
      console.log('Profane joke filter disabled!');
    } else if (decision === 'clean') {
      config.set('explicit', false);
      console.log('Profane joke filter enabled!');
    }

    return 0;
  },
  register(subparsers) {
    const joke = subparsers.addParser(command, {
      addHelp: true,
      help: `${command} help`
    });

    joke.addArgument('decision', {
      choices: ['enable', 'disable', 'explicit', 'clean']
    });
  }
};
