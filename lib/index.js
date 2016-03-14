'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _file = require('./core/file');

var _file2 = _interopRequireDefault(_file);

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = _bluebird2.default.promisifyAll(require("fs"));

var directoriesReducer = function directoriesReducer(result, currentPath) {
	return _helpers2.default.listDirectoryFiles(currentPath, result);
};

var filesMapper = function filesMapper(filePath) {
	return fs.readFileAsync(filePath, { encoding: 'utf8' }).then(function (content) {
		var folder = _path2.default.dirname(getPathRelativeToCWD(filePath)),
		    name = _path2.default.basename(filePath);
		return new _file2.default(content, name, folder).parse();
	});
};

var getPathRelativeToCWD = _helpers2.default.getPathRelativeTo(process.cwd());

// TODO Implement injection of extensions via command line
var getExtensions = function getExtensions() {
	return Topisto.EXTENSIONS;
};

var Topisto = function () {
	_createClass(Topisto, null, [{
		key: 'EXTENSIONS',
		get: function get() {
			return ['es6'];
		}
	}]);

	function Topisto() {
		_classCallCheck(this, Topisto);

		// TODO Read command line arguments
		// TODO Allow excluded folders
		// NOTE Is "process.cwd()" necessary?
		this.folders = [_path2.default.join(process.cwd(), 'src')];

		this.extensions = getExtensions();
	}

	_createClass(Topisto, [{
		key: 'run',
		value: function run() {
			return _bluebird2.default.reduce(this.folders, directoriesReducer, []).filter(_helpers2.default.filterWithExtensions(this.extensions)).map(filesMapper).filter(function (file) {
				return file.annotations && file.annotations.length;
			});
		}
	}]);

	return Topisto;
}();

exports.default = Topisto;
//# sourceMappingURL=index.js.map