import R from 'ramda';

export const LINE_TYPE_SINGLE = 'singleLine';
export const LINE_TYPE_MULTI = 'multiLine';

export const ANNOTATION_TYPE_TODO = 'TODO';
export const ANNOTATION_TYPE_NOTE = 'NOTE';
export const ANNOTATION_TYPE_FIXME = 'FIXME';


export const EMPTY_LINE = /^\s*$/;
export const NEW_LINE = /[\r\n]+/g;

// TODO: Allow new patterns to be injected
export let COMMENT_PATTERNS = [
	{
		type: 'default',
		extensions: [],
		matchers: [
			{
				type: LINE_TYPE_SINGLE,
				pattern: {
					start: /^#/
				}
			}
		]
	},
	{
		type: 'javascript',
		extensions: [
			'js',
			'es6'
		],
		matchers: [
			{
				type: LINE_TYPE_SINGLE,
				pattern: {
					start: /^\/\//
				}
			},
			{
				type: LINE_TYPE_MULTI,
				pattern: {
					start: /^\/\*/,
					end: /\*\/$/
				}
			}
		],
		cleaners: [
			/\*+/g,
			/-+/g
		]
	},
	{
		type: 'css',
		extensions: [
			'css',
			'scss'
		],
		matchers: [
			{
				type: LINE_TYPE_SINGLE,
				pattern: {
					start: /^\/\//
				}
			},
			{
				type: LINE_TYPE_MULTI,
				pattern: {
					start: /^\/\*/,
					end: /\*\/$/
				}
			}
		],
		cleaners: [
			/\*+/g,
			/-+/g
		]
	}
];

let typePatternsFilter = R.curry(function(type, commentPattern){
	return commentPattern.type === type;
});

let extensionPatternsFilter = R.curry(function(extension, commentPattern){
	return commentPattern.extensions.indexOf(extension) > -1;
});

export let getCommentPatternsForExtension = function(_extension){
	let extension = _extension.substring(0, 1) === '.'
		? _extension.substring(1)
		: _extension;

	let patternsForExtension = COMMENT_PATTERNS.filter(extensionPatternsFilter(extension));

	return patternsForExtension.length
		? patternsForExtension[0]
		: patternsForType('default');
}

export let getCommentPatternsForType = function(type){
	let patternsForType = COMMENT_PATTERNS.filter(typePatternsFilter(type));

	return patternsForType.length
		? patternsForType[0]
		: patternsForType('default')[0];
}

export let getFileTypeForExtension = function(extension){
	return getCommentPatternsForExtension(extension).type;
}

export const ANNOTATION_PATERNS = [
	{
		type: ANNOTATION_TYPE_TODO,
		pattern: /^TODO\W*/
	},
	{
		type: ANNOTATION_TYPE_NOTE,
		pattern: /^NOTE\W*/
	},
	{
		type: ANNOTATION_TYPE_FIXME,
		pattern: /^FIXME\W*/
	}
];
