import path from 'path';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { execSync } from 'child_process';
import { sync } from 'rimraf';

const localPackage = path.join(__dirname, '..');
const binDir = path.join(localPackage, 'bin');
const binInstall = path.join(binDir, 'install');
const srcCommitMsgPath = path.join(localPackage, 'hooks', 'commit-msg');

const tmpDir = path.join(__dirname, 'tmp');
const tmpGitDir = path.join(tmpDir, '.git');
const tmpHooksDir = path.join(tmpGitDir, 'hooks');
const tmpCommitMsgPath = path.join(tmpHooksDir, 'commit-msg');

const fixture = {
  resetTmpDir: () => {
    if (existsSync(tmpDir)) {
      sync(tmpDir);
    }

    mkdirSync(tmpDir);

    execSync(`git init ${tmpDir}`);
  },
  installInTmpDir: () => {
    execSync(`cd ${tmpDir} && node ${binInstall}`);
  }
};

describe('Installation Tests', () => {
  before(() => {
    fixture.resetTmpDir();
  });

  it('Package installation overwrites git hook if Husky environment variable not found',
    () => {
      console.log(binInstall);
      fixture.installInTmpDir();

      // verify hook installation
      existsSync(tmpCommitMsgPath).should.equal(true);
      readFileSync(srcCommitMsgPath).should.eql(readFileSync(tmpCommitMsgPath));
    });
});
