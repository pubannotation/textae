var getAreaIn = function($parent) {
	var $area = $parent.find('.textae-editor__footer .textae-editor__footer__message');
	if ($area.length === 0) {
		$area = $('<div>').addClass('textae-editor__footer__message');
		var $footer = $('<div>')
			.addClass('textae-editor__footer')
			.append($area);
		$parent.append($footer);
	}

	return $area;
};

module.exports = function(editor) {
	var getAreaInEditor = _.partial(getAreaIn, editor),
		status = function(message) {
			if (message !== '') getAreaInEditor().html('Source: ' + message);
		};

	return {
		status: status
	};
};