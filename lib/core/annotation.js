'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _patterns = require('./patterns');

var PATTERNS = _interopRequireWildcard(_patterns);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Annotation = function () {
	_createClass(Annotation, null, [{
		key: 'createAnnotation',
		value: function createAnnotation(comment) {
			var annotation = null,
			    headerLine = comment.type === PATTERNS.LINE_TYPE_SINGLE ? comment.content : comment.content[0],
			    annotationRule = PATTERNS.ANNOTATION_PATERNS.filter(function (matcher) {
				return matcher.pattern.test(headerLine);
			});

			if (annotationRule.length) {
				annotationRule = annotationRule[0];
			} else {
				annotationRule = null;
			}

			if (annotationRule) {
				var content = comment.content;
				if (comment.type === PATTERNS.LINE_TYPE_SINGLE) {
					content = content.replace(annotationRule.pattern, '');
				} else {
					content[0] = content[0].replace(annotationRule.pattern, '');
				}

				annotation = new Annotation(annotationRule.type, content, comment);
			}

			return annotation;
		}
	}]);

	function Annotation(type, content, comment) {
		_classCallCheck(this, Annotation);

		this.type = type;
		this.content = content;
		this.comment = comment;
	}

	return Annotation;
}();

exports.default = Annotation;
//# sourceMappingURL=annotation.js.map