var debounce300 = function(func) {
		return _.debounce(func, 300);
	},
	sixteenTimes = function(val) {
		return val * 16;
	},
	// Redraw all editors in tha windows.
	redrawAllEditor = function() {
		$(window).trigger('resize');
	},
	createContent = function() {
		return $('<div>')
			.addClass('textae-editor__setting-dialog');
	},
	// Open the dialog.
	open = function($dialog) {
		return $dialog.open();
	};

module.exports = function(editor, editMode) {
	var typeGapValue,
		changeLineHeight = debounce300(_.compose(redrawAllEditor, editMode.changeLineHeight, sixteenTimes)),
		addInstanceRelationView = function($content) {
			return $content.append($('<div>')
					.append('<label class="textae-editor__setting-dialog__label">Instance/Relation View')
					.append($('<input>')
						.attr({
							'type': 'checkbox'
						})
						.addClass('textae-editor__setting-dialog__term-centric-view')
					)
				)
				.on('click', '.textae-editor__setting-dialog__term-centric-view', function() {
					if ($(this).is(':checked')) {
						editMode.toInstance();
						updateTypeGapValue($content);
					} else {
						editMode.toTerm();
						updateTypeGapValue($content);
					}
				});
		},
		addTypeGap = function($content) {
			return $content.append($('<div>')
				.append('<label class="textae-editor__setting-dialog__label">Type Gap')
				.append($('<input>')
					.attr({
						type: 'number',
						step: 1,
						min: 0,
						max: 5
					}).addClass('textae-editor__setting-dialog__type_gap')
				)
			).on('change', '.textae-editor__setting-dialog__type_gap', debounce300(
				function(val) {
					editMode.changeTypeGap($(this).val());
					updateLineHeight($content);
				}
			));
		},
		addLineHeight = function($content) {
			return $content
				.append($('<div>')
					.append('<label class="textae-editor__setting-dialog__label">Line Height')
					.append($('<input>')
						.attr({
							'type': 'number',
							'step': 1,
							'min': 3,
							'max': 50
						})
						.addClass('textae-editor__setting-dialog__line-height')
					))
				.on('change', '.textae-editor__setting-dialog__line-height', function() {
					changeLineHeight($(this).val());
				});
		},
		appendDialog = function($content) {
			return require('../util/getDialog')(editor.editorId, 'textae.dialog.setting', 'Chage Settings', $content, true);
		},
		// Update the checkbox state, because it is updated by the button on control too.
		updateViewMode = function($dialog) {
			return $dialog.find('.textae-editor__setting-dialog__term-centric-view')
				.prop({
					'checked': editMode.showInstance ? 'checked' : null
				})
				.end();
		},
		updateTypeGapValue = function($dialog) {
			updateLineHeight($dialog);

			return $dialog.find('.textae-editor__setting-dialog__type_gap')
				.prop({
					value: editMode.typeGap
				})
				.end();
		},
		updateLineHeight = function($dialog) {
			return $dialog.find('.textae-editor__setting-dialog__line-height')
				.prop({
					value: editMode.lineHeight
				})
				.end();
		};

	return _.compose(
		open,
		updateLineHeight,
		updateTypeGapValue,
		updateViewMode,
		appendDialog,
		addLineHeight,
		addTypeGap,
		addInstanceRelationView,
		createContent
	);
};