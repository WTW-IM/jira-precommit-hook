import Configstore from 'configstore';
import pkg from '../package.json';

const config = new Configstore(pkg.name, { jokes: true });

export default config;
