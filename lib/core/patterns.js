'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ANNOTATION_PATERNS = exports.getFileTypeForExtension = exports.getCommentPatternsForType = exports.getCommentPatternsForExtension = exports.COMMENT_PATTERNS = exports.NEW_LINE = exports.EMPTY_LINE = exports.ANNOTATION_TYPE_FIXME = exports.ANNOTATION_TYPE_NOTE = exports.ANNOTATION_TYPE_TODO = exports.LINE_TYPE_MULTI = exports.LINE_TYPE_SINGLE = undefined;

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LINE_TYPE_SINGLE = exports.LINE_TYPE_SINGLE = 'singleLine';
var LINE_TYPE_MULTI = exports.LINE_TYPE_MULTI = 'multiLine';

var ANNOTATION_TYPE_TODO = exports.ANNOTATION_TYPE_TODO = 'TODO';
var ANNOTATION_TYPE_NOTE = exports.ANNOTATION_TYPE_NOTE = 'NOTE';
var ANNOTATION_TYPE_FIXME = exports.ANNOTATION_TYPE_FIXME = 'FIXME';

var EMPTY_LINE = exports.EMPTY_LINE = /^\s*$/;
var NEW_LINE = exports.NEW_LINE = /[\r\n]+/g;

// TODO: Allow new patterns to be injected
var COMMENT_PATTERNS = exports.COMMENT_PATTERNS = [{
	type: 'default',
	extensions: [],
	matchers: [{
		type: LINE_TYPE_SINGLE,
		pattern: {
			start: /^#/
		}
	}]
}, {
	type: 'javascript',
	extensions: ['js', 'es6'],
	matchers: [{
		type: LINE_TYPE_SINGLE,
		pattern: {
			start: /^\/\//
		}
	}, {
		type: LINE_TYPE_MULTI,
		pattern: {
			start: /^\/\*/,
			end: /\*\/$/
		}
	}],
	cleaners: [/\*+/g, /-+/g]
}, {
	type: 'css',
	extensions: ['css', 'scss'],
	matchers: [{
		type: LINE_TYPE_SINGLE,
		pattern: {
			start: /^\/\//
		}
	}, {
		type: LINE_TYPE_MULTI,
		pattern: {
			start: /^\/\*/,
			end: /\*\/$/
		}
	}],
	cleaners: [/\*+/g, /-+/g]
}];

var typePatternsFilter = _ramda2.default.curry(function (type, commentPattern) {
	return commentPattern.type === type;
});

var extensionPatternsFilter = _ramda2.default.curry(function (extension, commentPattern) {
	return commentPattern.extensions.indexOf(extension) > -1;
});

var getCommentPatternsForExtension = exports.getCommentPatternsForExtension = function getCommentPatternsForExtension(_extension) {
	var extension = _extension.substring(0, 1) === '.' ? _extension.substring(1) : _extension;

	var patternsForExtension = COMMENT_PATTERNS.filter(extensionPatternsFilter(extension));

	return patternsForExtension.length ? patternsForExtension[0] : patternsForType('default');
};

var getCommentPatternsForType = exports.getCommentPatternsForType = function getCommentPatternsForType(type) {
	var patternsForType = COMMENT_PATTERNS.filter(typePatternsFilter(type));

	return patternsForType.length ? patternsForType[0] : patternsForType('default')[0];
};

var getFileTypeForExtension = exports.getFileTypeForExtension = function getFileTypeForExtension(extension) {
	return getCommentPatternsForExtension(extension).type;
};

var ANNOTATION_PATERNS = exports.ANNOTATION_PATERNS = [{
	type: ANNOTATION_TYPE_TODO,
	pattern: /^TODO\W*/
}, {
	type: ANNOTATION_TYPE_NOTE,
	pattern: /^NOTE\W*/
}, {
	type: ANNOTATION_TYPE_FIXME,
	pattern: /^FIXME\W*/
}];
//# sourceMappingURL=patterns.js.map