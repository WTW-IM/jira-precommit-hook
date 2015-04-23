import {findParentFolder, copyHookFiles} from './fs-utils.js';

let currentPath = process.env.pwd;

try{
  copyHookFiles(findParentFolder(currentPath, '.git'));
} catch(error) {
  console.log(error.message);
}
