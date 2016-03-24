import pkg from '../package.json';
import { ArgumentParser } from 'argparse';
import { register, execute } from './cli-commands';

async function run() {
  const parser = new ArgumentParser({
    version: pkg.version,
    addHelp: true,
    description: 'jira-precommit-hook configuration utility'
  });

  register(parser);

  const args = parser.parseArgs();
  const exitCode = await execute(args);
  process.exit(exitCode);
}

run();
