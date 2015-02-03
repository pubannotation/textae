module.exports = function(editor, reject) {
    if (reject.hasError) {
        var GetEditorDialog = require('../util/dialog/GetEditorDialog');
        new GetEditorDialog(editor)(
            'textae.dialog.validation',
            'The following erronious annotations ignored',
            $('<span>').text(JSON.stringify(reject)),
            true
        ).open();
    }
};
