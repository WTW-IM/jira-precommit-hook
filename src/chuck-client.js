import request from 'request-promise';
import fileSys from 'fs';

const baseUrl = 'http://api.icndb.com/jokes/';
const fileName = '.chuckNorris';

const client = class ChuckClient {
  getRandomJoke() {
    const options = {
      uri: `${baseUrl}random`,
      qs: {
        escape: 'javascript'
      }
    };

    return request(options)
      .then(json => {
        const value = JSON.parse(json).value;
        return value.joke;
      });
  }

  isChuckEnabled() {
    const homeDirectory = process.env.HOME || process.env.USERPROFILE;
    return fileSys.existsSync(`${homeDirectory}/${fileName}`);
  }
};

export default client;
