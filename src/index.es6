import path from 'path';
import Promise from 'bluebird';

import File from './core/file';
import helpers from './helpers';

let fs = Promise.promisifyAll(require("fs"));

let directoriesReducer = function(result, currentPath){
	return helpers.listDirectoryFiles(currentPath, result);
};

let filesMapper = function(filePath){
	return fs.readFileAsync(filePath, {encoding:'utf8'})
		.then(function(content){
			let folder = path.dirname(getPathRelativeToCWD(filePath)),
				name = path.basename(filePath);
			return new File(content, name, folder).parse();
		});
};

let getPathRelativeToCWD = helpers.getPathRelativeTo(process.cwd());

// TODO Implement injection of extensions via command line
let getExtensions = function(){
	return Topisto.EXTENSIONS;
}

export default class Topisto{
	static get EXTENSIONS() { return ['es6'] }

	constructor(){
		// TODO Read command line arguments
		// TODO Allow excluded folders
		// NOTE Is "process.cwd()" necessary?
		this.folders = [
			path.join(process.cwd(), 'src')
		];

		this.extensions = getExtensions();
	}

	run(){
		return Promise.reduce(this.folders, directoriesReducer, [])
			.filter(helpers.filterWithExtensions(this.extensions))
			.map(filesMapper)
			.filter(function(file){
				return file.annotations && file.annotations.length;
			});
	}
}
