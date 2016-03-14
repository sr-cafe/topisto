'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _patterns = require('./patterns');

var PATTERNS = _interopRequireWildcard(_patterns);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Comment = function () {
	_createClass(Comment, null, [{
		key: 'createComment',
		value: function createComment(rules, _text, lineNumber, linesArray) {

			var comment = null,
			    text = _text.trim(),
			    commentRule = rules.matchers.filter(function (matcher) {
				return matcher.pattern.start.test(text);
			});

			if (commentRule.length) {
				commentRule = commentRule[0];
			} else {
				commentRule = null;
			}

			if (commentRule) {
				if (commentRule.type === PATTERNS.LINE_TYPE_SINGLE) {
					comment = Comment.createSingleLineComment(_text, lineNumber);
				} else {
					comment = Comment.createMultilineComment(_text, lineNumber, commentRule, linesArray);
				}
			}

			return Comment.cleanCommentContent(comment, commentRule, rules.cleaners);
		}
	}, {
		key: 'createSingleLineComment',
		value: function createSingleLineComment(content, lineNumber) {
			return new Comment(PATTERNS.LINE_TYPE_SINGLE, content, {
				start: lineNumber,
				end: lineNumber
			});
		}
	}, {
		key: 'createMultilineComment',
		value: function createMultilineComment(_text, startLine, rule, linesArray) {
			var matcher = rule.pattern.end,
			    scanLines = linesArray.slice(startLine),
			    closingCommentLine = void 0,
			    comment = void 0;

			scanLines.some(function (line, i) {
				return matcher.test(line.trim()) ? (closingCommentLine = i, true) : false;
			});

			var range = {
				start: startLine,
				end: startLine + closingCommentLine
			};

			var content = linesArray.slice(range.start, range.end + 1);

			// Overwrite those lines on the original array so we don't need to scan them
			for (var i = range.start + 1; i <= range.end; i++) {
				linesArray[i] = '';
			}

			if (content.length > 1) {
				comment = new Comment(PATTERNS.LINE_TYPE_MULTI, content, range);
			} else {
				comment = new Comment(PATTERNS.LINE_TYPE_SINGLE, content[0], range);
			}

			return comment;
		}
	}, {
		key: 'cleanCommentContent',
		value: function cleanCommentContent(comment, rule, _cleaners) {
			if (rule) {
				if (comment.type === PATTERNS.LINE_TYPE_SINGLE) {
					var cleaners = [rule.pattern.start];
					if (_cleaners) {
						cleaners = cleaners.concat(_cleaners);
					}
					comment.content = Comment.cleanCommentLine(comment.content, cleaners);
				} else {
					comment.content = comment.content.map(function (line, index, array) {
						var cleaners = [];
						if (index === 0) {
							cleaners.push(rule.pattern.start);
						}

						if (index === array.length - 1) {
							cleaners.push(rule.pattern.end);
						}

						if (_cleaners) {
							cleaners = cleaners.concat(_cleaners);
						}

						return Comment.cleanCommentLine(line, cleaners);
					}).filter(function (line) {
						return line.trim().length > 0;
					});
				}
			}

			return comment;
		}
	}, {
		key: 'cleanCommentLine',
		value: function cleanCommentLine(line, cleaners) {
			return cleaners.reduce(function (previous, current) {
				return previous.replace(current, '').trim();
			}, line.trim());
		}
	}]);

	function Comment(type, content, range) {
		_classCallCheck(this, Comment);

		this.type = type;
		this.originalContent = content;
		this.content = content;
		this.range = range;
	}

	return Comment;
}();

exports.default = Comment;
//# sourceMappingURL=comment.js.map