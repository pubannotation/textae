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
    isContains = function(property,dictionary,  data) {
        if (!dictionary) return false;

        return dictionary
            .filter(function(entry) {
                return entry.id === data[property];
            }).length === 1;
    },
    validateAnnotation = function(annotation) {
        var resultDenotationHasLength = validate(
                annotation.denotations,
                hasLength
            ),
            resultDenotationInText = validate(
                resultDenotationHasLength.accept,
                isBeginAndEndIn,
                annotation.text
            ),
            resultRelationObj = validate(
                annotation.relations,
                isContains,
                'obj',
                resultDenotationInText.accept
            ),
            resultRelationSubj = validate(
                resultRelationObj.accept,
                isContains,
                'subj',
                resultDenotationInText.accept
            ),
            resultModification = validate(
                annotation.modifications,
                isContains,
                'obj',
                _.union(resultDenotationInText.accept, resultRelationSubj.accept)
            );

        return {
            accept: {
                denotation: resultDenotationInText.accept,
                relation: resultRelationSubj.accept,
                modification: resultModification.accept
            },
            reject: {
                denotationHasLength: resultDenotationHasLength.reject,
                denotationInText: resultDenotationInText.reject,
                relationObj: resultRelationObj.reject,
                relationSubj: resultRelationSubj.reject,
                modification: resultModification.reject
            }
        };
    };

module.exports = validateAnnotation;
