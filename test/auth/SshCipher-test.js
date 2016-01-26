import SshAgent from '../../src/auth/SshCipher.js';

const someString = 'someString';
const someStringBase64 = (someString.toString('base64'));

const dummyEmptySSHAgent = {
  requestIdentities(callback) {
    callback(null, []);
  }
};

const dummySSHAgent = {
  requestIdentities(callback) {
    callback(null, [{
      type: 'ssh-rsa',
      _raw: someString
    }]);
  }
};

const dummySSHAgent2 = {
  requestIdentities(callback) {
    callback(null, [{
      type: 'ssh-rsa',
      _raw: someString
    }, {
      type: 'ssh-rsa',
      _raw: 'someIncorrectString'
    }]);
  }
};

describe('SshCipher', () => {
  describe('getPassword', () => {
    it('Errors when there are no SSH keys', async function test() {
      const sshAgent = new SshAgent({ client: dummyEmptySSHAgent });
      try {
        await sshAgent.getPassword();
      } catch (err) {
        expect(err.message).to.eql('The ssh-agent returned no usable keys.');
      }
    });

    it('Returns the base64 string of the key if it exists', async function test() {
      const sshAgent = new SshAgent({ client: dummySSHAgent });
      const result = await sshAgent.getPassword();
      expect(result).to.eql(someStringBase64);
    });

    it('Returns the base64 string of the first key if multiple exist', async function test() {
      const sshAgent = new SshAgent({ client: dummySSHAgent2 });
      const result = await sshAgent.getPassword();
      expect(result).to.eql(someStringBase64);
    });
  });
  describe('Encrypt/Decrypt', () => {
    it('Encrypts the string given, not just encoded in base64', async function test() {
      const sshAgent = new SshAgent({ client: dummySSHAgent });
      const result = await sshAgent.encrypt(someString);
      expect(result).to.not.eql(someStringBase64);
    });

    it('Encrypts the string given and decrypts back', async function test() {
      const sshAgent = new SshAgent({ client: dummySSHAgent });
      const encryptResult = await sshAgent.encrypt(someString);
      const decryptResult = await sshAgent.decrypt(encryptResult);
      expect(encryptResult).to.not.eql(someString);
      expect(decryptResult).to.eql(someString);
    });
  });
});
