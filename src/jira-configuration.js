import {readJSON} from './fs-utils.js';
import _ from 'lodash';

export function validateAPIConfig(config) {
  // validate that this is a proper .jirarc file
  if (!config.host) {
    throw new Error('.jirarc missing host url. Please check the README for details');
  }
  if (!config.projectName) {
    throw new Error('.jirarc missing project name. Please check the README for details');
  }
  const defaults = {
    protocol: 'http',
    port: 80,
    version: 2,
    verbose: false,
    strictSSL: true
  };
  const configDefaults = _.defaults(config, defaults);
  return configDefaults;
}

export function validateAuthentication(authConfig) {
  // validate that there are proper credentials
  if (!authConfig.username) {
    throw new Error('.userconfig missing username');
  }
  if (!authConfig.password) {
    throw new Error('.userconfig missing password');
  }
  return authConfig;
}

export function getAPIConfig(filePath) {
  return readJSON(filePath)
    .then(config => validateAPIConfig(config));
}

export function getAuthentication(filePath) {
  return readJSON(filePath)
      .then(config => validateAuthentication(config));
}
