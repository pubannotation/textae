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
		return jQuerySugar.Div('textae-editor__setting-dialog');
	},
	// Open the dialog.
	open = function($dialog) {
		return $dialog.open();
	},
	jQuerySugar = require('../util/jQuerySugar'),
	// Update the checkbox state, because it is updated by the button on control too.
	updateViewMode = function(editMode, $content) {
		return jQuerySugar.setChecked(
			$content,
			'.mode',
			editMode.showInstance ? 'checked' : null
		);
	},
	updateLineHeight = function(editMode, $content) {
		return jQuerySugar.setValue(
			$content,
			'.line-height',
			editMode.lineHeight
		);
	},
	updateTypeGapValue = function(typeGap, $content) {
		return jQuerySugar.setValue(
			$content,
			'.type-gap',
			typeGap.get
		);
	},
	toTypeGap = function($content) {
		return $content.find('.type-gap');
	},
	updateTypeGapEnable = function(editMode, $content) {
		jQuerySugar.enabled(toTypeGap($content), editMode.showInstance);
		return $content;
	},
	changeMode = function(editMode, typeGap, $content, checked) {
		if (checked) {
			editMode.toInstance();
		} else {
			editMode.toTerm();
		}
		updateTypeGapEnable(editMode, $content);
		updateTypeGapValue(typeGap, $content);
		updateLineHeight(editMode, $content);
	},
	SettingDialogLabel = _.partial(jQuerySugar.Label, 'textae-editor__setting-dialog__label');

module.exports = function(editor, editMode, typeGap) {
	var addInstanceRelationView = function($content) {
			var onModeChanged = debounce300(function() {
				changeMode(editMode, typeGap, $content, $(this).is(':checked'));
			});

			return $content
				.append(jQuerySugar.Div()
					.append(
						new SettingDialogLabel('Instance/Relation View')
					)
					.append(
						jQuerySugar.Checkbox('textae-editor__setting-dialog__term-centric-view mode')
					)
				)
				.on(
					'click',
					'.mode',
					onModeChanged
				);
		},
		addTypeGap = function($content) {
			var onTypeGapChange = debounce300(
				function() {
					typeGap.set($(this).val());
					updateLineHeight(editMode, $content);
				}
			);

			return $content
				.append(jQuerySugar.Div()
					.append(
						new SettingDialogLabel('Type Gap')
					)
					.append(
						jQuerySugar.Number('textae-editor__setting-dialog__type-gap type-gap')
						.attr({
							step: 1,
							min: 0,
							max: 5
						})
					)
				).on(
					'change',
					'.type-gap',
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
				.append(jQuerySugar.Div()
					.append(
						new SettingDialogLabel('Line Height')
					)
					.append(
						jQuerySugar.Number('textae-editor__setting-dialog__line-height line-height')
						.attr({
							'step': 1,
							'min': 3,
							'max': 50
						})
					))
				.on(
					'change',
					'.line-height',
					onLineHeightChange
				);
		},
		appendToDialog = function($content) {
			return require('../util/dialog/GetEditorDialog')(editor)(
				'textae.dialog.setting',
				'Setting',
				$content,
				true
			);
		},
		partialEditMode = function(func) {
			return _.partial(func, editMode);
		};

	// Update values after creating a dialog because the dialog is re-used.
	return _.compose(
		open,
		partialEditMode(updateLineHeight),
		_.partial(updateTypeGapValue, typeGap),
		partialEditMode(updateTypeGapEnable),
		partialEditMode(updateViewMode),
		appendToDialog,
		addLineHeight,
		addTypeGap,
		addInstanceRelationView,
		createContent
	);
};
