'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _comment = require('./comment');

var _comment2 = _interopRequireDefault(_comment);

var _annotation = require('./annotation');

var _annotation2 = _interopRequireDefault(_annotation);

var _patterns = require('./patterns');

var PATTERNS = _interopRequireWildcard(_patterns);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var commentsMapper = _ramda2.default.curry(function (rules, line, index, array) {
	return _comment2.default.createComment(rules, line, index, array);
});

var notNullFilter = function notNullFilter(item) {
	return item !== null;
};

var File = function () {
	function File(content, name, folder) {
		_classCallCheck(this, File);

		this.content = content;
		this.name = name;
		this.folder = folder;

		this.type = this.getType();
	}

	_createClass(File, [{
		key: 'getType',
		value: function getType() {
			var extension = _path2.default.extname(this.name);
			return PATTERNS.getFileTypeForExtension(extension);
		}
	}, {
		key: 'getRules',
		value: function getRules() {
			return PATTERNS.getCommentPatternsForType(this.type);
		}
	}, {
		key: 'parse',
		value: function parse() {
			this.annotations = this.content.split('\n').map(commentsMapper(this.getRules())).filter(notNullFilter).map(function (comment) {
				return _annotation2.default.createAnnotation(comment);
			}).filter(notNullFilter);

			return this;
		}
	}, {
		key: 'toString',
		value: function toString() {
			return this.path;
		}
	}]);

	return File;
}();

exports.default = File;
//# sourceMappingURL=file.js.map