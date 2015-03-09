var getUrlParameters = require('./getUrlParameters'),
	priorUrl = function(params, editor, name) {
		if (!params[name] && editor.attr(name))
			params[name] = editor.attr(name);
	},
	priorAttr = function(params, editor, name) {
		if (editor.attr(name))
			params[name] = editor.attr(name);
	};

module.exports = function(editor) {
	// Read model parameters from url parameters and html attributes.
	var params = getUrlParameters(location.search);

	// 'source' prefer to 'target'
	params.target = editor.attr('source') || editor.attr('target') || params.source || params.target;

	priorAttr(params, editor, 'config');
	priorAttr(params, editor, 'status_bar');

	// Mode is prior in the url parameter.
	priorUrl(params, editor, 'mode');

	// Read Html text and clear it.
	var inlineAnnotation = editor.text();
	editor.empty();

	// Set annotaiton parameters.
	params.annotation = {
		inlineAnnotation: inlineAnnotation,
		url: params.target
	};

	// console.log(params);

	return params;
};
