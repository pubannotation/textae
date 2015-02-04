var Dialog = require('./Dialog'),
    getDialogId = function(editorId, id) {
        return editorId + '.' + id;
    },
    defaultOption = {
        width: 550,
        height: 220
    };

module.exports = function(editorId, id, title, $content, option) {
    var openOption = _.extend({}, defaultOption, option);

    if (option && option.noCancelButton) {
        openOption.buttons = {};
    } else {
        openOption.buttons = {
            Cancel: function() {
                $(this).dialog('close');
            }
        };
    }

    var $dialog = new Dialog(
        openOption,
        getDialogId(editorId, id),
        title,
        $content
    );

    return _.extend($dialog, {
        id: id
    });
};
