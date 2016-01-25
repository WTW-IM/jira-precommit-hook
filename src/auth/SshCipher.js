import SSHAgentClient from 'ssh-agent';
import crypto from 'crypto';

export default class SshCipher {
  constructor(options = {}) {
    this.algorithm = options.algorithm || 'aes256';
    this.client = options.client || new SSHAgentClient();
    this.requestIdentities = function requestIdentities() {
      return new Promise((resolve, reject) => {
        this.client.requestIdentities((err, keys) => {
          if (err) {
            reject(err);
          }
          resolve(keys);
        });
      });
    };
  }

  async getPassword() {
    if (!this._identityKey) {
      const keys = await this.requestIdentities();
      const possibleKeys = keys.filter(x => x.type === 'ssh-rsa');
      const key = possibleKeys[0];
      if (!key) {
        throw new Error('The ssh-agent returned no usable keys.');
      }

      this._identityKey = key._raw.toString('base64');
    }
    return this._identityKey;
  }

  async encrypt(data, password) {
    const realPassword = password || await this.getPassword();
    const encrypt = crypto.createCipher(this.algorithm, realPassword);
    encrypt.write(data);
    encrypt.end();

    return encrypt.read().toString('base64');
  }

  async decrypt(data, password) {
    const realPassword = password || await this.getPassword();
    const decrypt = crypto.createDecipher(this.algorithm, realPassword);
    decrypt.write(new Buffer(data, 'base64'));
    decrypt.end();

    return decrypt.read().toString();
  }
}
