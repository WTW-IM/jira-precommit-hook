import {readJSON} from './fs-utils.js';
import fs from 'fs';
import lodash from 'lodash';

export function validateAPIConfig(config){
	// validate that this is a proper .jirarc file
	if(!config.host || !config.projectName) {
		throw new Error('.jirarc missing required field(s). Please check the README for details');
	}
  let defaults = {
    protocol: 'http',
    port: 80,
    version: '2.0.0',
    verbose: false,
    strictSSL: true
  };
  config = lodash.defaults(config, defaults);
  return config;
}

export function validateAuthentication(authConfig){
	// validate that there are proper credentials
	if(!authConfig.username || !authConfig.password) {
		throw new Error('.userconfig missing required field(s)');
	}
	return authConfig;
}

export function getAPIConfig(filePath){
	return readJSON(filePath)
		.then(config => validateAPIConfig(config));
}

export function getAuthentication(filePath) {
  return readJSON(filePath)
      .then(config => validateAuthentication(config));
}
