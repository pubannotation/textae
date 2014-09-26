module.exports = function($target, enable) {
	if (enable) {
		$target.removeAttr('disabled');
	} else {
		$target.attr('disabled', 'disabled');
	}
};