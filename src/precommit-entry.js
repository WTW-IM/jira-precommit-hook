import fsp from 'fs-promise';
export default function precommit (path) {
	return fsp.readFile(path, {encoding: 'utf8'});
}
