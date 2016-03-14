import * as PATTERNS from './patterns';

export default class Comment{
	static createComment(rules, _text, lineNumber, linesArray){

		let comment = null,
			text = _text.trim(),
			commentRule = rules.matchers.filter(function(matcher){
				return matcher.pattern.start.test(text);
			});

		if(commentRule.length){
			commentRule = commentRule[0];
		}
		else{
			commentRule = null;
		}

		if(commentRule){
			if(commentRule.type === PATTERNS.LINE_TYPE_SINGLE){
				comment = Comment.createSingleLineComment(_text, lineNumber);
			}
			else{
				comment = Comment.createMultilineComment(
					_text,
					lineNumber,
					commentRule,
					linesArray
				);
			}
		}

		return Comment.cleanCommentContent(comment, commentRule, rules.cleaners);
	}

	static createSingleLineComment(content, lineNumber){
		return new Comment(
			PATTERNS.LINE_TYPE_SINGLE,
			content,
			{
				start: lineNumber,
				end: lineNumber
			}
		);
	}

	static createMultilineComment(_text, startLine, rule, linesArray){
		let matcher = rule.pattern.end,
			scanLines = linesArray.slice(startLine),
			closingCommentLine,
			comment;

			scanLines.some(function(line, i) {
				return matcher.test(line.trim())
					? ((closingCommentLine = i), true)
					: false;
			});

			let range = {
				start: startLine,
				end: startLine + closingCommentLine
			};

			let content = linesArray.slice(range.start, range.end + 1);

			// Overwrite those lines on the original array so we don't need to scan them
			for(let i = range.start + 1; i <= range.end; i++){
				linesArray[i] = '';
			}

			if(content.length > 1){
				comment = new Comment(PATTERNS.LINE_TYPE_MULTI, content, range);
			}
			else{
				comment = new Comment(PATTERNS.LINE_TYPE_SINGLE, content[0], range);
			}

			return comment;
	}

	static cleanCommentContent(comment, rule, _cleaners){
		if(rule){
			if(comment.type === PATTERNS.LINE_TYPE_SINGLE){
				let cleaners = [rule.pattern.start];
				if(_cleaners){
					cleaners = cleaners.concat(_cleaners);
				}
				comment.content = Comment.cleanCommentLine(comment.content, cleaners);
			}
			else{
				comment.content = comment.content.map(function(line, index, array){
					let cleaners = [];
					if(index === 0){
						cleaners.push(rule.pattern.start);
					}

					if(index === array.length -1){
						cleaners.push(rule.pattern.end);
					}

					if(_cleaners){
						cleaners = cleaners.concat(_cleaners);
					}

					return Comment.cleanCommentLine(line, cleaners);

				}).filter(function(line){
					return line.trim().length > 0;
				});
			}
		}

		return comment;
	}

	static cleanCommentLine(line, cleaners){
		return cleaners.reduce(function(previous, current){
			return previous.replace(current, '').trim();
		}, line.trim());
	}

	constructor(type, content, range){
		this.type = type;
		this.originalContent = content;
		this.content = content;
		this.range = range;
	}
}
