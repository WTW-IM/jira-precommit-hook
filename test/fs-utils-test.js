import {findParentFolder, copyHookFiles, verifyHooksFolder} from '../src/fs-utils.js';
import path from 'path';
import fsys from 'fs';
import fsp from 'fs-promise';
import rimraf from 'rimraf';

const tmpDir = path.join(__dirname, 'tmp');
const tmpGitDir = path.join(tmpDir, '.git');
const hooksDir = path.join(tmpGitDir, 'hooks');
const commitMsgPath = path.join(hooksDir, 'commit-msg');

describe('FS-Utils Tests', () => {
  before(() =>
    fsp.exists(tmpDir)
      .then(exists => {
        if (!exists) {
          return fsp.mkdir(tmpDir)
            .then(() => fsp.mkdir('test/tmp/.git'));
        }
      })
  );

  describe('Finding Directory', () => {
    it('Finding Named Directory', () => {
      const gitPath = findParentFolder(__dirname, '.git');
      gitPath.should.equal(path.join(__dirname, '../.git'));
    });

    it('Unable to Find Desired Directory', () => {
      const funct = () => { findParentFolder(path.join(__dirname, '../../')); };
      expect(funct).to.throw(Error);
    });
  });

  describe('Hooks folder verification', () => {
    beforeEach(() => {
      const pathString = path.resolve(hooksDir);
      const hooksExists = fsys.existsSync(pathString);
      if (hooksExists) {
        rimraf.sync(pathString);
      }
    });

    it('Confirm hooks folder exists', () => {
      verifyHooksFolder(hooksDir);
      assert(fsys.existsSync(hooksDir));
    });
  });

  describe('Hook Installation', () => {
    before(() =>
      fsp.exists(hooksDir)
        .then(exists => {
          if (!exists) {
            return fsp.mkdir(hooksDir);
          }
        })
    );

    beforeEach(() =>
      fsp.exists(commitMsgPath)
        .then(exists => {
          if (exists) {
            return fsp.unlink(commitMsgPath);
          }
        })
    );

    it('Hook Creation Test', (done) => {
      copyHookFiles(tmpGitDir)
      .then(() => {
        fsys.existsSync(commitMsgPath).should.equal(true);
        done();
      });
    });

    it('Validate Hook File is Correct', (done) => {
      let newFile;
      let oldFile;
      copyHookFiles(tmpGitDir)
      .then(() => {
        newFile = fsys.readFileSync(commitMsgPath);
        oldFile = fsys.readFileSync('hooks/commit-msg');
        newFile.should.eql(oldFile);
        done();
      });
    });
  });
});
