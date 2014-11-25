var deferAlert = require('./deferAlert');

module.exports = function(parser) {
	var showAlertIfOtherSpan = function(selection) {
			if (parser.isInSameParagraph(selection)) {
				return true;
			}

			deferAlert('It is ambiguous for which span you want to adjust the boundary. Select the span, and try again.');
			return false;
		},
		commonValidate = function(spanConfig, selection) {
			// The order is not important.
			return showAlertIfOtherSpan(selection) &&
				parser.isAnchrNodeInSpanOrParagraph(selection) &&
				parser.hasCharacters(spanConfig, selection);
		},
		validateOnText = function(spanConfig, selection) {
			return commonValidate(spanConfig, selection) &&
				parser.isFocusNodeInParagraph(selection);
		},
		validateOnSpan = function(spanConfig, selection) {
			return commonValidate(spanConfig, selection) &&
				parser.isFocusNodeInSpan(selection);
		};

	return {
		validateOnText: validateOnText,
		validateOnSpan: validateOnSpan
	};
};