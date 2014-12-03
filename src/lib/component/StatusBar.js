var getMessageAreaFrom = function($parent) {
	var $messageArea = $parent.find('.textae-editor__footer .textae-editor__footer__message');
	if ($messageArea.length === 0) {
		$messageArea = $('<div>').addClass('textae-editor__footer__message');
		var $footer = $('<div>')
			.addClass('textae-editor__footer')
			.append($messageArea);
		$parent.append($footer);
	}

	return $messageArea;
};

module.exports = function(editor) {
	var getMessageAreaFromEditor = _.partial(getMessageAreaFrom, editor),
		updateSoruceInfo = function(inlineElement) {
			if (inlineElement !== '') getMessageAreaFromEditor().html('Source: ' + inlineElement);
		};

	return {
		updateSoruceInfo: updateSoruceInfo
	};
};