module.exports = function(editor, model) {
	var spanEditor = null,
		selectionParser = require('./selectionParser')(editor, model),
		selectionValidater = require('./SelectionValidater')(selectionParser),
		selectEndOfText = function(data) {
			var isValid = selectionValidater.validateOnText(data.spanConfig, data.selection);

			if (isValid) {
				_.compose(spanEditor.expand, spanEditor.create)(data);
			}
		},
		selectEndOnSpan = function(data) {
			var isValid = selectionValidater.validateOnSpan(data.spanConfig, data.selection);

			if (isValid) {
				_.compose(spanEditor.shrink, spanEditor.expand, spanEditor.create)(data);
			}
		};

	return {
		init: function(command, viewModel, typeContainer, isDetectDelimiterEnable) {
			spanEditor = require('./SpanEditor')(editor, model, command, viewModel, typeContainer, isDetectDelimiterEnable);
		},
		onText: selectEndOfText,
		onSpan: selectEndOnSpan
	};
};