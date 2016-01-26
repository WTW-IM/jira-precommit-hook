import Auth, { authVersion } from '../../src/auth/Auth';

describe('Auth', () => {
  const filePath = '~/.jira-precommit-hook';
  let rawData;
  beforeEach(() => {
    rawData = {
      [authVersion]: {
        username: 'me',
        password: 'myencryptedpass'
      },
      'otherVersion': {
        username: 'otherMe',
        password: 'otherMyencryptedpass'
      }
    };
  });

  describe('#isSetup', () => {
    async function loadStub() {
      this._rawData = rawData;
    }

    it('detects when already setup', async () => {
      const auth = new Auth(filePath, {
        async exists(path) {
          path.should.equal(filePath);
          return true;
        }
      });
      auth.load = loadStub;

      const result = await auth.isSetup();
      result.should.be.true;
    });

    it('detects when it has never been setup', async () => {
      const auth = new Auth(filePath, {
        async exists(path) {
          path.should.equal(filePath);
          return false;
        }
      });
      auth.load = loadStub;

      const result = await auth.isSetup();
      result.should.be.false;
    });

    it('saves setup check result when true', async () => {
      let called = false;
      const auth = new Auth(filePath, {
        async exists(path) {
          if (called) {
            throw new Error('Should only get called once');
          }

          path.should.equal(filePath);
          called = true;
          return true;
        }
      });
      auth.load = sinon.spy(loadStub);

      const result1 = await auth.isSetup();
      const result2 = await auth.isSetup();
      result1.should.be.true;
      result2.should.be.true;
      auth.load.should.have.been.calledOnce;
    });

    it('does not save setup check when it has never been setup', async () => {
      let called = false;

      const auth = new Auth(filePath, {
        async exists(path) {
          const response = called;
          path.should.equal(filePath);
          called = true;
          return response;
        }
      });
      auth.load = loadStub;

      const result1 = await auth.isSetup();
      const result2 = await auth.isSetup();
      result1.should.be.false;
      result2.should.be.true;
    });

    it('is not setup when the version does not match', async () => {
      rawData = {
        'otherVersion': { }
      };

      const auth = new Auth(filePath, {
        async exists(path) {
          path.should.equal(filePath);
          return true;
        }
      });
      auth.load = loadStub;

      const result = await auth.isSetup();
      result.should.be.false;
    });
  });

  const dummyCipher = {
    encrypt(data) {
      return data;
    },
    decrypt(data) {
      return data;
    }
  };
  const encipherMap = {
    'mypass': 'myencryptedpass',
    'mythirdpass': 'mythirdencryptedpass'
  };
  const decipherMap = {
    'myencryptedpass': 'mypass',
    'myencryptedthirdpass': 'mythirdpass'
  };
  const cipherMock = {
    encrypt(data) {
      return encipherMap[data];
    },
    decrypt(data) {
      return decipherMap[data];
    }
  };

  const fspMock = {
    async readFile(path) {
      return JSON.stringify(rawData, null, 2);
    },
    async writeFile(fakefilePath, data) {
      return JSON.parse(data);
    }
  };

  describe('#load', () => {
    it('does not re-read file if already read', async () => {
      const auth = new Auth(filePath, {
        async readFile(path) {
          throw new Error('Should not get called');
        }
      }, dummyCipher);
      auth._rawData = rawData;
      await auth.load();
    });

    it('reads data from file', async () => {
      const auth = new Auth(filePath, fspMock, dummyCipher);
      await auth.load();
      auth._rawData.should.eql(rawData);
    });

    it('extracts username from file for current version', async () => {
      const auth = new Auth(filePath, fspMock, cipherMock);
      await auth.load();
      auth.username.should.equal('me');
    });

    it('extracts password from file and calls decrypt on cipher for current version', async () => {
      const auth = new Auth(filePath, fspMock, cipherMock);
      await auth.load();
      auth.password.should.equal('mypass');
    });

    it('extracts nother from file with no entries for current version', async () => {
      rawData = {
        'otherVersion': {
          username: 'me',
          password: 'myencryptedPassword'
        }
      };
      const auth = new Auth(filePath, fspMock, cipherMock);
      await auth.load();
      auth._rawData.should.eql(rawData);
      expect(auth.username).to.be.undefined;
      expect(auth.password).to.be.undefined;
    });
  });

  describe('#save', () => {
    it('writes data to a file, and calls the cipher.encrypt on the information', async () => {
      const auth = new Auth(filePath, fspMock, cipherMock);
      auth.username = 'me';
      auth.password = 'mypass';
      const result = await auth.save();
      expect(result).to.eql({
        v1: {
          username: 'me',
          password: 'myencryptedpass'
        }
      });
    });

    it('writes data to a file, maintaining previous usernames/passwords', async () => {
      const auth = new Auth(filePath, fspMock, cipherMock);
      await auth.load();
      const result = await auth.save();
      expect(result).to.eql({
        otherVersion: {
          password: 'otherMyencryptedpass',
          username: 'otherMe'
        },
        v1: {
          username: 'me',
          password: 'myencryptedpass'
        }
      });
    });

    it('maintains previous usernames/passwords after updating current one', async () => {
      const auth = new Auth(filePath, fspMock, cipherMock);
      await auth.load();
      auth.updateCreds('myNewUsername', 'mythirdpass');
      const result = await auth.save();
      expect(result).to.eql({
        otherVersion: {
          password: 'otherMyencryptedpass',
          username: 'otherMe'
        },
        v1: {
          username: 'myNewUsername',
          password: 'mythirdencryptedpass'
        }
      });
    });
  });

  describe('#updateCreds and #authCreds', () => {
    it('authCreds returns the correct credentials', async () => {
      const auth = new Auth(filePath, fspMock, cipherMock);
      await auth.load();
      const result = auth.authCreds();
      expect(result).to.eql({
        username: 'me',
        password: 'mypass'
      });
    });

    it('authCreds returns the correct credentials after updateCreds updates them', async () => {
      const auth = new Auth(filePath, fspMock, cipherMock);
      await auth.load();
      auth.updateCreds('myNewUsername', 'mythirdpass');
      const result = auth.authCreds();
      expect(result).to.eql({
        username: 'myNewUsername',
        password: 'mythirdpass'
      });
    });
  });
});
