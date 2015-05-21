export function anyPromise(arrayOfPromises) {
  if(arrayOfPromises === undefined) {
    return Promise.reject(new Error('No arguments provided'));
  }

  if(!(arrayOfPromises instanceof Array) || arrayOfPromises.length === 0) {
    return Promise.reject(new Error('Argument is not a non-array'));
  }

  if(arrayOfPromises.length === 1) {
    return arrayOfPromises[0];
  }

  let resolve, reject;
  let result = new Promise((x, y) => {
    resolve = x;
    reject = y;
  });

  let rejects = [];

  arrayOfPromises.forEach(p => {
    p
      .then(x => {
        resolve(x);
      })
      .catch(err => {
        rejects.push(err);

        if(rejects.length === arrayOfPromises.length) {
          reject(rejects);
        }
      });
  });

  return result;
}
