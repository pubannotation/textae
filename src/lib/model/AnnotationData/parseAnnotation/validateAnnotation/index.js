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
    isContains = function(property, dictionary, data) {
        if (!dictionary) return false;

        return dictionary
            .filter(function(entry) {
                return entry.id === data[property];
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
                isContains,
                'obj',
                resultDenotationInParagraph.accept
            ),
            resultRelationSubj = validate(
                resultRelationObj.accept,
                isContains,
                'subj',
                resultDenotationInParagraph.accept
            ),
            resultModification = validate(
                annotation.modifications,
                isContains,
                'obj',
                _.union(resultDenotationInParagraph.accept, resultRelationSubj.accept)
            );

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
