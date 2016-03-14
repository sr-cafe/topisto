import R from 'ramda';
import * as PATTERNS from './patterns';
import AnnotationContent from './annotationContent';

export default class Annotation{
	static createAnnotation(comment){
		let annotation = null,
			headerLine = (comment.type === PATTERNS.LINE_TYPE_SINGLE) ? comment.content : comment.content[0],
			annotationRule = PATTERNS.ANNOTATION_PATERNS.filter(function(matcher){
				return matcher.pattern.test(headerLine);
			});

		if(annotationRule.length){
			annotationRule = annotationRule[0];
		}
		else{
			annotationRule = null;
		}

		if(annotationRule){
			let content = comment.content;
			if(comment.type === PATTERNS.LINE_TYPE_SINGLE){
				content = content.replace(annotationRule.pattern, '')
			}
			else{
				content[0] = content[0].replace(annotationRule.pattern, '');
			}
			
			annotation = new Annotation(annotationRule.type, content, comment);
		}

		return annotation;
	}

	constructor(type, content, comment){
		this.type = type;
		this.content = content;
		this.comment = comment;
	}
}
