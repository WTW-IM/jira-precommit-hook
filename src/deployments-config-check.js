import fs from 'fs-promise'; // eslint-disable-line id-length
import fsUtils from './fs-utils.js';

export async function checkValidJSON({
  fileSystem = fs,
  fileSystemUtils = fsUtils
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

    throw err;
  }
}
