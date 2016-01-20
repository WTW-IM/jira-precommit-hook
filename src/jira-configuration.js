import { readJSON } from './fs-utils.js';

export function validateAPIConfig(config) {
  // validate that this is a proper .jirarc file
  if (!config.host) {
    throw new Error('.jirarc missing host url. Please check the README for details');
  }
  if (!config.projectName) {
    throw new Error('.jirarc missing project name. Please check the README for details');
  }
  return config;
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

export async function getAPIConfig(filePath) {
  const config = await readJSON(filePath);
  return validateAPIConfig(config);
}

export async function getAuthentication(filePath) {
  const config = await readJSON(filePath);
  return validateAuthentication(config);
}
