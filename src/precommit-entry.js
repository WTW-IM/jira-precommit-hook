import fsp from 'fs-promise';

export function getCommitMsg (path) {
  return fsp.readFile(path, {encoding: 'utf8'});
}

export function getIssueReference(msgToParse, prjKey) {
  let pattern = new RegExp(`${prjKey}-\\d+`, 'g');
  let commentPattern = RegExp(`#.*`, 'g');

  msgToParse = msgToParse.replace(commentPattern, '');

  let refrences = msgToParse.match(pattern);
  let unique = null;

  if(refrences !== null) {
    unique = refrences.slice()
      .sort((a, b) => {
        return a - b;
      })
      .reduce((a, b) => {
        if (a.slice(-1)[0] !== b) {
          a.push(b);
        }
        return a;
      }, []);
  }

  return unique;
}
