import jokes from './jokes';
import configcheck from './configcheck';
const map = {
  [jokes.command]: jokes,
  [configcheck.command]: configcheck
};

export function register(parser) {
  const subparsers = parser.addSubparsers({
    title: 'commands',
    dest: 'command'
  });

  Object.keys(map).forEach(command => map[command].register(subparsers));
}

export async function execute({ command, ...options }) {
  return map[command].execute(options);
}
