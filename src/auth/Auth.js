import fsp from 'fs-promise';

export const authVersion = 'v1';

export default class Auth {
  constructor(filePath, fileSystem = fsp) {
    this.filePath = filePath;
    this.fileSystem = fileSystem;
  }

  authCreds() {
    return {
      username: this.username,
      password: this.password
    };
  }

  updateCreds(username, password) {
    this.username = username;
    this.password = password;
  }

  async isSetup() {
    if (!this._rawData) {
      if (! await this.fileSystem.exists(this.filePath)) {
        return false;
      }

      await this.load();
    }

    return !!this._rawData[authVersion];
  }

  async load() {
    if (this._rawData) {
      return;
    }

    const contents = await this.fileSystem.readFile(this.filePath);
    this._rawData = JSON.parse(contents);

    const data = this._rawData[authVersion];

    if (data) {
      this.username = data.username;
      this.password = data.password;
    }
  }

  async save() {
    throw new Error('Not Implemented yet');
  }
}
