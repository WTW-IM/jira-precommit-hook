import request from 'request-promise';
import boxen from 'boxen';
import wordwrap from 'wordwrap';
import size from 'window-size';
import chalk from 'chalk';

export default function fetchJoke(config) {
  if (!config.get('jokes')) {
    return async () => {};
  }

  let options;
  if (!config.get('explicit')) {
    options = {
      uri: 'http://api.icndb.com/jokes/random',
      qs: {
        escape: 'javascript',
        limitTo: 'nerdy'
      }
    };
  } else {
    options = {
      uri: 'http://api.icndb.com/jokes/random',
      qs: {
        escape: 'javascript'
      }
    };
  }

  const jokeRequest = request(options);
  jokeRequest.catch(err => {}); // This is to hide any errors from hitting the console.

  return async () => {
    try {
      const json = await jokeRequest;
      const { joke } = JSON.parse(json).value;
      const wrap = wordwrap(size.width - 10);
      const wrapped = wrap(`Good work now enjoy this joke. You deserve it!\n\n${joke}\n\n` + //eslint-disable-line
                           chalk.grey('If you want to disable these jokes run: \n' +
                           '> ./node_modules/.bin/jira-precommit jokes disable'));
      console.log(boxen(
        wrapped,
        {
          padding: 1,
          margin: 1
        }
      ));
    } catch (err) {} // eslint-disable-line
  };
}
