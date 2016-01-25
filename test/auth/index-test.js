import authIndex from '../../src/auth/index';

const dummyInfo = {
  username: 'username',
  password: 'password'
};

const dummyPromptInfo = {
  username: 'otherusername',
  password: 'otherpassword'
};

const dummySuccessAuth = {
  isSetup() {
    return dummyInfo;
  }
};

const dummyPromptAuth = {
  isSetup() {
    return false;
  },
  updateCreds(username, password) {
    this.username = username;
    this.password = password;
  },
  save() {
    this.saveCalled = true;
  }
};

function dummyAuthPromptMethod() {
  return dummyPromptInfo;
}

describe('Auth Index', () => {
  beforeEach(() => {
    dummyPromptAuth.saveCalled = false;
    dummyPromptAuth.username = '';
    dummyPromptAuth.password = '';
  });

  it('returns loaded information if it exists', async function test() {
    const result = await authIndex(dummySuccessAuth);
    expect(result).to.eql(dummyInfo);
  });

  it('Prompts user if creds do not exist, and updates auth with them', async function test() {
    const result = await authIndex(dummyPromptAuth, dummyAuthPromptMethod);
    expect(result).to.eql(dummyPromptInfo);
    expect(dummyPromptAuth.username).to.eql(dummyPromptInfo.username);
    expect(dummyPromptAuth.password).to.eql(dummyPromptInfo.password);
    expect(dummyPromptAuth.saveCalled).to.eql(true);
  });
});
