import {findParentFolder, getFilePath, copyHookFiles, verifyHooksFolder} from '../src/fs-utils.js';
import path from 'path';
import fs from 'fs';
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
        if(!exists) {
          return fsp.mkdir(tmpDir)
            .then(() => fsp.mkdir('test/tmp/.git'));
        }
      })
  );

  describe('Finding Directory', () => {
    it('Finding Named Directory', () => {
      let gitPath = findParentFolder(__dirname, '.git');
      gitPath.should.equal(path.join(__dirname, '../.git'));
    });

    it('Unable to Find Desired Directory', () => {
      let fn = () => { findParentFolder(path.join(__dirname, '../../')); };
      expect(fn).to.throw(Error);
    });
  });

  describe('Hooks folder verification', () => {
    beforeEach(() => {
      let pathString = path.resolve(hooksDir);
      let hooksExists = fs.existsSync(pathString);
      if(hooksExists) {
        rimraf.sync(pathString);
      }
    });

    it('Confirm hooks folder exists', () => {
      verifyHooksFolder(hooksDir);
      assert(fs.existsSync(hooksDir));
    });
  });

  describe('Hook Installation', () => {
    before(() =>
      fsp.exists(hooksDir)
        .then(exists => {
          if(!exists) {
            return fsp.mkdir(hooksDir);
          }
        })
    );

    beforeEach(() =>
      fsp.exists(commitMsgPath)
        .then(exists => {
          if(exists) {
            return fsp.unlink(commitMsgPath);
          }
        })
    );

    it('Hook Creation Test', (done) => {
      copyHookFiles(tmpGitDir)
      .then(() => {
         fs.existsSync(commitMsgPath).should.equal(true);
         done();
      });
    });

    it('Validate Hook File is Correct', (done) => {
      copyHookFiles(tmpGitDir)
      .then(() => {
        let newFile = fs.readFileSync(commitMsgPath);
        let oldFile = fs.readFileSync('hooks/commit-msg');
        newFile.should.eql(oldFile);
        done();
      });
    });
  });

  describe('Finding Specified File', () => {
    it('.gitignore is Found from Test', () => {
      let gitPath = getFilePath(__dirname, '.gitignore');
      gitPath.should.equal(path.join(__dirname, '../.gitignore'));
    });

    it('Unable to Find Specified File', () => {
      let fn = () => { getFilePath(path.join(__dirname, '../../')); };
      expect(fn).to.throw(Error);
    });
  });
});
