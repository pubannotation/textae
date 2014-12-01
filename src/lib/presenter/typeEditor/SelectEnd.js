module.exports = function(editor, model, command, viewModel, typeContainer) {
	var selectionParser = require('./selectionParser')(editor, model),
		selectionValidater = require('./SelectionValidater')(selectionParser),
		delimiterDetectAdjuster = require('../spanAdjuster/delimiterDetectAdjuster'),
		blankSkipAdjuster = require('../spanAdjuster/blankSkipAdjuster'),
		spanAdjuster = delimiterDetectAdjuster,
		spanEditor = require('./SpanEditor')(editor, model, command, viewModel, typeContainer, spanAdjuster),
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
		onText: selectEndOfText,
		onSpan: selectEndOnSpan
	};
};