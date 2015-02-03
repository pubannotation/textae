var validate = require('./validate'),
    hasLength = function(denotation) {
        return denotation.span.end - denotation.span.begin > 0;
    },
    isInText = function(boundary, text) {
        return 0 <= boundary && boundary <= text.length;
    },
    isBeginAndEndIn = function(text, denotation) {
        return isInText(denotation.span.begin, text) &&
            isInText(denotation.span.end, text);
    },
    isInParagraph = function(paragraph, denotation) {
        return paragraph.all()
            .filter(function(p) {
                return p.begin <= denotation.span.begin && denotation.span.end <= p.end;
            }).length === 1;
    },
    isContains = function(opt, data) {
        if (!opt.dictionary) return false;

        return opt.dictionary
            .filter(function(entry) {
                return entry.id === data[opt.property];
            }).length === 1;
    },
    validateAnnotation = function(text, paragraph, annotation) {
        var resultDenotationHasLength = validate(
                annotation.denotations,
                hasLength
            ),
            resultDenotationInText = validate(
                resultDenotationHasLength.accept,
                isBeginAndEndIn,
                text
            ),
            resultDenotationInParagraph = validate(
                resultDenotationInText.accept,
                isInParagraph,
                paragraph
            ),
            resultRelationObj = validate(
                annotation.relations,
                isContains, {
                    property: 'obj',
                    dictionary: resultDenotationInParagraph.accept
                }),
            resultRelationSubj = validate(
                resultRelationObj.accept,
                isContains, {
                    property: 'subj',
                    dictionary: resultDenotationInParagraph.accept
                }),
            resultModification = validate(
                annotation.modifications,
                isContains, {
                    property: 'obj',
                    dictionary: _.union(resultDenotationInParagraph.accept, resultRelationSubj.accept)
                });

        return {
            accept: {
                denotation: resultDenotationInParagraph.accept,
                relation: resultRelationSubj.accept,
                modification: resultModification.accept
            },
            reject: {
                denotationHasLength: resultDenotationHasLength.reject,
                denotationInText: resultDenotationInText.reject,
                denotationInParagraph: resultDenotationInParagraph.reject,
                relationObj: resultRelationObj.reject,
                relationSubj: resultRelationSubj.reject,
                modification: resultModification.reject
            }
        };
    };

module.exports = validateAnnotation;
