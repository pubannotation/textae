var typeCounter = [],
    makeTypePrefix = function(editorId, prefix) {
        return editorId + '__' + prefix;
    },
    makeId = function(editorId, prefix, id) {
        return makeTypePrefix(editorId, prefix) + id;
    },
    spanDelimiter = '_';

module.exports = function(editor) {
    var spanPrefix = makeTypePrefix(editor.editorId, 'S');

    return {
        // The ID of spans has editorId and begin and end, like 'editor1__S0_15'.
        makeSpanId: function(span) {
            return spanPrefix + span.begin + spanDelimiter + span.end;
        },
        // Get a span object from the spanId.
        parseSpanId: function(spanId) {
            var beginEnd = spanId.replace(spanPrefix, '').split(spanDelimiter);
            return {
                begin: Number(beginEnd[0]),
                end: Number(beginEnd[1])
            };
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
        makeEntityDomId: _.partial(makeId, editor.editorId, 'E'),
        makeParagraphId: _.partial(makeId, editor.editorId, 'P')
    };
};