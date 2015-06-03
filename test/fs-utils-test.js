import {findParentFolder, getFilePath, copyHookFiles, verifyHooksFolder} from '../src/fs-utils.js';
import path from 'path';
import fs from 'fs';
import fsp from 'fs-promise';
import rimraf from 'rimraf';

describe('FS-Utils Tests', () => {
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
      let pathString = path.resolve(path.join('test', 'tmp', '.git', 'hooks'));
      let hooksExists = fsp.existsSync(pathString);
      if(hooksExists) {
        rimraf.sync(pathString);
      }
    });

    it('Confirm hooks folder exists', () => {
      verifyHooksFolder(path.join('test', 'tmp', '.git', 'hooks'));
      assert(fs.existsSync(path.join('test', 'tmp', '.git', 'hooks')));
    });
  });

  describe('Hook Installation', () => {
    before(() => fsp.exists('test/tmp')
      .then(exists => {
        if(!exists) {
          fsp.mkdir('test/tmp')
          .then(() => fsp.mkdir('test/tmp/.git'))
          .then(() => fsp.mkdir('test/tmp/.git/hooks'));
          }
        }
      ));

    beforeEach(() => fsp.exists('test/tmp/.git/hooks/commit-msg')
      .then(exists => {
        if(exists) {
          return fsp.unlink('test/tmp/.git/hooks/commit-msg');
        }
    }));

    it('Hook Creation Test', (done) => {
      copyHookFiles(path.join(__dirname, '/tmp/.git'))
      .then(() => {
         fs.existsSync('test/tmp/.git/hooks/commit-msg').should.equal(true);
         done();
      });
    });

    it('Validate Hook File is Correct', (done) => {
      copyHookFiles(path.join(__dirname, '/tmp/.git'))
      .then(() => {
        let newFile = fs.readFileSync('test/tmp/.git/hooks/commit-msg');
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
