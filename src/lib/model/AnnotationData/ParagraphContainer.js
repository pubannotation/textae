var idFactory = require('../../util/idFactory');

module.exports = function(editor, annotationDataApi) {
    var mappingFunction = function(sourceDoc) {
            sourceDoc = sourceDoc || [];
            var textLengthBeforeThisParagraph = 0;

            return sourceDoc.split("\n")
                .map(function(p, index) {
                    var ret = {
                        id: idFactory.makeParagraphId(editor, index),
                        begin: textLengthBeforeThisParagraph,
                        end: textLengthBeforeThisParagraph + p.length,
                    };

                    textLengthBeforeThisParagraph += p.length + 1;
                    return ret;
                });
        },
        contaier = require('./ModelContainer')(annotationDataApi, 'paragraph', mappingFunction),
        api = _.extend(contaier, {
            //get the paragraph that span is belong to.
            getBelongingTo: function(span) {
                var match = contaier.all().filter(function(p) {
                    return span.begin >= p.begin && span.end <= p.end;
                });

                if (match.length === 0) {
                    throw new Error('span should belong to any paragraph.');
                } else {
                    return match[0];
                }
            }
        });

    return api;
};
