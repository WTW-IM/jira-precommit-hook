import fsp from 'fs-promise';

export const authVersion = 'v1';

export default class Auth {
  constructor(filePath, fileSystem = fsp, cipher = {}) {
    this.filePath = filePath;
    this.fileSystem = fileSystem;
    this.cipher = cipher;
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

  async load(encrypted = false) {
    if (this._rawData) {
      return;
    }

    let contents = await this.fileSystem.readFile(this.filePath);
    if (encrypted) {
      contents = this.cipher.decrypt(contents);
    }
    this._rawData = JSON.parse(contents);

    const data = this._rawData[authVersion];

    if (data) {
      this.data = data;
      this.username = data.username;
      this.password = data.password;
    }
  }

  async save() {
    const data = JSON.stringify({
      ...this.data,
      [authVersion]: {
        username: this.username,
        password: this.password
      }
    });
    await this.fileSystem.writeFile(this.filePath, data);
  }
}
