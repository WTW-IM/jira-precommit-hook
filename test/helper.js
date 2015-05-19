import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import 'sinon-as-promised';
import sinonChai from 'sinon-chai';

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

global.expect = chai.expect;
global.assert = chai.assert;
global.sinon = sinon;
