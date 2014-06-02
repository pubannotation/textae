     var makeIdFactory = function(editor) {
         var typeCounter = [];
         return {
             // The ID of spans has editorId and begin and end, like 'editor1__S0_15'.
             makeSpanId: function(begin, end) {
                 return editor.editorId + '__S' + begin + '_' + end;
             },
             // Get a span object from the spanId.
             parseSpanId: function(spanId) {
                 var beginEnd = spanId.replace(editor.editorId + '__S', '').split('_');
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
             makeEntityDomId: function(entityId) {
                 return editor.editorId + '__E' + entityId;
             },
             makeParagraphId: function(index) {
                 return editor.editorId + '__P' + index;
             }
         };
     };