module.exports = function() {
	// Cash a div for dialog by self, because $('#dialog_id') cannot find exists div element.
	var cash = {};

	return function(editorId, id, title, $content, noCancelButton) {
		var makeDialog = function(id) {
			var $dialog = $('<div>')
				.attr('id', id)
				.attr('title', title)
				.hide()
				.append($content);

			$.extend($dialog, {
				open: function() {
					this.dialog({
						resizable: false,
						width: 550,
						height: 220,
						modal: true,
						buttons: noCancelButton ? {} : {
							Cancel: function() {
								$(this).dialog('close');
							}
						}
					});
				},
				close: function() {
					this.dialog('close');
				},
			});

			return $dialog;
		};

		var dialogId = editorId + '.' + id;

		if (cash.hasOwnProperty(dialogId)) {
			return cash[dialogId];
		} else {
			// Make unless exists
			var $dialog = makeDialog(dialogId);

			$.extend($content, {
				dialogClose: function() {
					$dialog.close();
				}
			});

			$('body').append($dialog);
			cash[dialogId] = $dialog;
			return $dialog;
		}
	};
}();