import jokes from './jokes';

const map = {
  [jokes.command]: jokes
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
