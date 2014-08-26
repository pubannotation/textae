var ControlDialog = function() {
		var Dialog = function(id, title, $content) {
				return $('<div>')
					.attr('id', id)
					.attr('title', title)
					.hide()
					.append($content);
			},
			OpenCloseMixin = function($dialog, openOption) {
				return {
					open: function() {
						$dialog.dialog(openOption);
					},
					close: function() {
						$dialog.dialog('close');
					},
				};
			},
			getDialogId = function(editorId, id) {
				return editorId + '.' + id;
			},
			extendDialog = function(openOption, $dialog) {
				return _.extend(
					$dialog,
					new OpenCloseMixin($dialog, openOption)
				);
			},
			appendDialog = function($dialog) {
				$('body').append($dialog);
				return $dialog;
			},
			ControlDialog = function(editorId, id, title, $content, noCancelButton) {
				var openOption = {
						resizable: false,
						width: 550,
						height: 220,
						modal: true,
						buttons: noCancelButton ? {} : {
							Cancel: function() {
								$(this).dialog('close');
							}
						}
					},
					extendDialogWithOpenOption = _.partial(extendDialog, openOption),
					createAndAppendDialog = _.compose(
						appendDialog,
						extendDialogWithOpenOption,
						Dialog
					),
					$dialog = createAndAppendDialog(
						getDialogId(editorId, id),
						title,
						$content
					);

				return _.extend($dialog, {
					id: id
				});
			};

		return ControlDialog;
	}(),
	FunctionUseCache = function() {
		var getFromContainer = function(container, id) {
				return container[id];
			},
			addToContainer = function(container, id, object) {
				container[id] = object;
				return object;
			},
			// A createFunction must return an object having a parameter 'id'.
			FunctionUseCache = function(createFunction) {
				var cache = {},
					serachCache = _.partial(getFromContainer, cache),
					addCache = _.partial(addToContainer, cache),
					createAndCache = function(createFunction, params) {
						object = createFunction.apply(null, params);
						return addCache(object.id, object);
					};

				return function(id, title, $content, noCancelButton) {
					return serachCache(id) ||
						createAndCache(createFunction, [id, title, $content, noCancelButton]);
				};
			};

		return FunctionUseCache;
	}();

module.exports = function(editor) {
	// Cash a div for dialog by self, because $('#dialog_id') cannot find exists div element.
	editor.getDialog = editor.getDialog || new FunctionUseCache(_.partial(ControlDialog, editor.editorId));
	return editor.getDialog;
};