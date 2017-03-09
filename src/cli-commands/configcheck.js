import fsp from 'fs-promise';
import fsys from 'fs';
import path from 'path';
const command = 'configcheck';

function recursiveWalk(dir) {
  var results = []; // eslint-disable-line no-var
  var list = fsys.readdirSync(dir); // eslint-disable-line no-var
  list.forEach((file) => {
    const newfile = path.join(dir, file);
    const stat = fsys.lstatSync(newfile);
    if (stat && stat.isDirectory()) {
      results = results.concat(recursiveWalk(newfile));
    } else {
      results.push(newfile);
    }
  });
  return results;
}

export function fileFilter(filename, regexPatterns = []) {
  if (regexPatterns.length === 0) {
    return true;
  }

  const actualResult = regexPatterns.some((x) => filename.match(x));
  return actualResult;
}

export default {
  command,
  async execute({}) {
    console.log('Checking hubot-deployments-config.json...');
    const workingDirectory = process.cwd();
    const deploymentConfigPath = path.join(workingDirectory, 'hubot-deployments-config.json');

    if (!fsys.existsSync(deploymentConfigPath)) {
      console.warn(`${deploymentConfigPath} does not exist.`);
      return 1;
    }

    const fileResult = await fsp.readFile(deploymentConfigPath);
    var jsonResult; // eslint-disable-line no-var
    try {
      jsonResult = JSON.parse(fileResult);
    } catch (err) {
      console.error(`hubot-deployments-config.json is not a valid JSON file. ${err.message}`);
      return 1;
    }

    console.log('hubot-deployments-config.json is valid JSON.  Showing debug file list...');
    const fileList = recursiveWalk(workingDirectory);
    const collectorMap = {};
    const allRegexPatterns = [];

    Object.keys(jsonResult).forEach(buildType => {
      allRegexPatterns.push(jsonResult[buildType]);
      collectorMap[buildType] = fileList.filter(x => fileFilter(x, jsonResult[buildType]));
    });

    console.log('Results:');
    Object.keys(collectorMap).forEach(buildType => {
      console.log(`Files Associated with ${buildType}:`);
      console.log(collectorMap[buildType]);
    });
    console.log('Uncovered Files:');
    console.log(fileList.filter(x => !fileFilter(x, allRegexPatterns)));
    return 0;
  },
  register(subparsers) {
    subparsers.addParser(command, {
      addHelp: true,
      help: `${command} help`
    });
  }
};
