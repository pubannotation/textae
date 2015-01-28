var typeCounter = [],
    makeTypePrefix = function(editorId, prefix) {
        return editorId + '__' + prefix;
    },
    makeId = function(editorId, prefix, id) {
        return makeTypePrefix(editorId, prefix) + id;
    },
    spanDelimiter = '_';

module.exports = {
    // The ID of spans has editorId and begin and end, like 'editor1__S0_15'.
    makeSpanId: function(editor, span) {
        var spanPrefix = makeTypePrefix(editor.editorId, 'S');
        return spanPrefix + span.begin + spanDelimiter + span.end;
    },
    // The ID of type has number of type.
    // This IDs are used for id of DOM element and css selector for jQuery.
    // But types are inputed by users and may have `!"#$%&'()*+,./:;<=>?@[\]^`{|}~` which can not be used for css selecor.
    makeTypeId: function(spanId, type) {
        if (typeCounter.indexOf(type) === -1) {
            typeCounter.push(type);
        }
        return spanId + '-' + typeCounter.indexOf(type);
    },
    makeEntityDomId: function(editor, id) {
        return makeId(editor.editorId, 'E', id);
    },
    makeParagraphId: function(editor, id) {
        return makeId(editor.editorId, 'P', id);
    }
};
