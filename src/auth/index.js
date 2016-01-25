import path from 'path';

const authVersion = 'v1';
const userHome = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
const authFilePath = path.join(userHome, '.jira-auth');

export default async function auth() {

}
