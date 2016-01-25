import path from 'path';
import Auth from './Auth';
import authPrompt from './authPrompt';
import SshCipher from './sshCipher';
import fsp from 'fs-promise';

const userHome = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
const authFilePath = path.join(userHome, '.jira-auth');
const ourCipher = new SshCipher();
const ourAuth = new Auth(authFilePath, fsp, ourCipher);

export default async function auth(authObj = ourAuth, authPromptMethod = authPrompt) {
  const authResult = await authObj.isSetup();
  if (authResult) {
    return authResult;
  }

  const authPromptResult = await authPromptMethod();
  authObj.updateCreds(authPromptResult.username, authPromptResult.password);
  await authObj.save();
  return authPromptResult;
}
