var Dialog = require('./Dialog'),
    getDialogId = function(editorId, id) {
        return editorId + '.' + id;
    };

module.exports = function(editorId, id, title, $content, noCancelButton) {
    var openOption = {
            width: 550,
            height: 220,
            buttons: noCancelButton ? {} : {
                Cancel: function() {
                    $(this).dialog('close');
                }
            }
        },
        $dialog = new Dialog(
            openOption,
            getDialogId(editorId, id),
            title,
            $content
        );

    return _.extend($dialog, {
        id: id
    });
};
