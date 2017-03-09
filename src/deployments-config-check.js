import fs from 'fs-promise'; // eslint-disable-line id-length
import fsUtils from './fs-utils.js';

export default async function checkValidJSON({
  fileSystem = fs,
  fileSystemUtils = fsUtils,
  log = console.log
}) {
  try {
    const filePath = fileSystemUtils.findParentFolder(process.cwd(),
                                                      'hubot-deployments-config.json');
    const fileResult = await fileSystem.readFile(filePath);
    const jsonResult = JSON.parse(fileResult);

    return !!jsonResult;
  } catch (err) {
    if (err.message.indexOf('Unexpected token') > -1) {
      throw new Error('hubot-deployments-config.json is not a valid JSON file.  Committing will ' +
                      `not succeed until the JSON is fixed. ${err.message}`);
    }
    if (err.message.indexOf('Cannot find') > -1
        && err.message.indexOf('hubot-deployments-config.json') > -1) {
      log('No hubot-deployments-config.json set up for this repository.');
      return false;
    }

    throw err;
  }
}
