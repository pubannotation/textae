module.exports = function() {
	var selection = window.getSelection();
	selection.collapse(document.body, 0);
};