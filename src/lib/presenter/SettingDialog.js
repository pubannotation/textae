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
	},
	// Update the checkbox state, because it is updated by the button on control too.
	updateViewMode = function(editMode, $content) {
		return $content.find('.textae-editor__setting-dialog__term-centric-view')
			.prop({
				'checked': editMode.showInstance ? 'checked' : null
			})
			.end();
	},
	updateLineHeight = function(editMode, $content) {
		return $content.find('.textae-editor__setting-dialog__line-height')
			.prop({
				value: editMode.lineHeight
			})
			.end();
	},
	updateTypeGapValue = function(editMode, $content) {
		return $content.find('.textae-editor__setting-dialog__type_gap')
			.prop({
				value: editMode.typeGap
			})
			.end();
	},
	changeMode = function(editMode, $content, checked) {
		if (checked) {
			editMode.toInstance();
		} else {
			editMode.toTerm();
		}
		updateTypeGapValue(editMode, $content);
		updateLineHeight(editMode, $content);
	};

module.exports = function(editor, editMode) {
	var addInstanceRelationView = function($content) {
			var onModeChanged = debounce300(function() {
				changeMode(editMode, $content, $(this).is(':checked'));
			});

			return $content.append($('<div>')
					.append('<label class="textae-editor__setting-dialog__label">Instance/Relation View')
					.append($('<input>')
						.attr({
							'type': 'checkbox'
						})
						.addClass('textae-editor__setting-dialog__term-centric-view')
					)
				)
				.on(
					'click',
					'.textae-editor__setting-dialog__term-centric-view',
					onModeChanged
				);
		},
		addTypeGap = function($content) {
			var onTypeGapChange = debounce300(
				function() {
					editMode.changeTypeGap($(this).val());
					updateLineHeight(editMode, $content);
				}
			);

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
			).on(
				'change',
				'.textae-editor__setting-dialog__type_gap',
				onTypeGapChange
			);
		},
		addLineHeight = function($content) {
			var changeLineHeight = _.compose(redrawAllEditor, editMode.changeLineHeight, sixteenTimes),
				onLineHeightChange = debounce300(
					function() {
						changeLineHeight($(this).val());
					}
				);

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
				.on(
					'change',
					'.textae-editor__setting-dialog__line-height',
					onLineHeightChange
				);
		},
		appendToDialog = function($content) {
			return require('../util/getDialog')(
				editor.editorId,
				'textae.dialog.setting',
				'Chage Settings',
				$content,
				true
			);
		},
		partialEditMode = function(func) {
			return _.partial(func, editMode);
		};

	return _.compose(
		open,
		appendToDialog,
		partialEditMode(updateLineHeight),
		addLineHeight,
		partialEditMode(updateTypeGapValue),
		addTypeGap,
		partialEditMode(updateViewMode),
		addInstanceRelationView,
		createContent
	);
};