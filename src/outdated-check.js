import 'colors';
import pkg from '../package.json';
import request from 'request-promise';

export default function checkOutdated() {
  return request(`https://registry.npmjs.org/${pkg.name}/latest`)
    .then(result => JSON.parse(result))
    .then(result => {
      if (pkg.version !== result.version) {
        let message = `WARNING: You are using version ${pkg.version} of the jira-precommit-hook. However, version ${result.version} has been released. To update run:`.yellow;
        message += '\n> '.grey + `npm install ${pkg.name}@${result.version} --save-dev\n`.green;
        console.warn(message);
      }
    });
}
