var SpanEditor = require('./SpanEditor'),
	selectEndOnText = function(selectionValidater, spanEditor, data) {
		var isValid = selectionValidater.validateOnText(data.spanConfig, data.selection);

		if (isValid) {
			_.compose(spanEditor.expand, spanEditor.create)(data);
		}
	},
	selectEndOnSpan = function(selectionValidater, spanEditor, data) {
		var isValid = selectionValidater.validateOnSpan(data.spanConfig, data.selection);

		if (isValid) {
			_.compose(spanEditor.shrink, spanEditor.expand, spanEditor.create)(data);
		}
	};

module.exports = function(editor, model, command, viewModel, typeContainer) {
	var selectionParser = require('./selectionParser')(editor, model),
		selectionValidater = require('./SelectionValidater')(selectionParser),
		// Initiated by events.
		selectEndOnTextImpl = null,
		selectEndOnSpanImpl = null,
		changeSpanEditorAccordingToButtons = function() {
			var isDetectDelimiterEnable = viewModel.modeAccordingToButton['boundary-detection'].value(),
				isReplicateAuto = viewModel.modeAccordingToButton['replicate-auto'].value(),
				spanEditor = new SpanEditor(editor, model, command, typeContainer, isDetectDelimiterEnable, isReplicateAuto);

			selectEndOnTextImpl = _.partial(selectEndOnText, selectionValidater, spanEditor);
			selectEndOnSpanImpl = _.partial(selectEndOnSpan, selectionValidater, spanEditor);
		};

	// Change spanEditor according to the  buttons state.
	changeSpanEditorAccordingToButtons();

	viewModel.modeAccordingToButton['boundary-detection']
		.bind('change', changeSpanEditorAccordingToButtons);

	viewModel.modeAccordingToButton['replicate-auto']
		.bind('change', changeSpanEditorAccordingToButtons);

	return {
		onText: function(data) {
			if (selectEndOnTextImpl) selectEndOnTextImpl(data);
		},
		onSpan: function(data) {
			if (selectEndOnSpanImpl) selectEndOnSpanImpl(data);
		}
	};
};