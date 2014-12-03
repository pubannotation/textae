module.exports = function(editor, confirmDiscardChangeMessage, history, statusBar, setAnnotationFunc) {
	return require('./component/DataAccessObject')(editor, confirmDiscardChangeMessage)
		.bind('save', function() {
			history.saved();
			toastr.success("annotation saved");
		})
		.bind('save error', function() {
			toastr.error("could not save");
		})
		.bind('load', function(data) {
			setAnnotationFunc(data.annotation);
			statusBar.updateSoruceInfo(data.source);
		});
};