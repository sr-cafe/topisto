import path from 'path';
import R from 'ramda';
import Comment from './comment';
import Annotation from './annotation';
import * as PATTERNS from './patterns';

let commentsMapper = R.curry(function(rules, line, index, array){
	return Comment.createComment(rules, line, index, array);
});


let notNullFilter = function(item){
	return item !== null;
};

export default class File{
	constructor(content, name, folder){
		this.content = content;
		this.name = name;
		this.folder = folder;

		this.type = this.getType();
	}

	getType(){
		let extension = path.extname(this.name);
		return PATTERNS.getFileTypeForExtension(extension);
	}

	getRules(){
		return PATTERNS.getCommentPatternsForType(this.type);
	}

	parse(){
		this.annotations = this.content.split('\n')
			.map(commentsMapper(this.getRules()))
			.filter(notNullFilter)
			.map(function(comment){
				return Annotation.createAnnotation(comment);
			})
			.filter(notNullFilter);

		return this;
	}

	toString(){
		return this.path;
	}
}
