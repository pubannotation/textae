var Result = function(reject) {
        return {
            accept: [],
            reject: reject ? reject : []
        };
    },
    isContains = function(dictionary, preperty, result, data) {
        var matches = dictionary
            .filter(function(entry) {
                return entry.id === data[preperty];
            });

        if (matches.length === 1)
            result.accept.push(data);
        else
            result.reject.push(data);

        return result;
    },
    isInText = function(boundary, text) {
        return 0 <= boundary && boundary <= text.length;
    },
    hasLength = function(result, denotation) {
        if (
            denotation.span.end - denotation.span.begin > 0
        ) {
            result.accept.push(denotation);
        } else {
            result.reject.push(denotation);
        }

        return result;
    },
    validateDenotationsHasLength = function(denotations) {
        if (!denotations) return new Result();

        return denotations.reduce(hasLength, new Result());
    },
    validateDenotationsInText = function(denotations, text) {
        if (!denotations) return new Result();

        var result = new Result();
        denotations.forEach(function(denotation) {
            if (
                isInText(denotation.span.begin, text) &&
                isInText(denotation.span.end, text)
            ) {
                result.accept.push(denotation);
            } else {
                result.reject.push(denotation);
            }

        });

        return result;
    },
    validateRelationsObj = function(relations, denotations) {
        if (!relations) return new Result();

        var objects = denotations ? denotations : [];
        return relations
            .reduce(
                _.partial(isContains, objects, 'obj'),
                new Result()
            );
    },
    validateRelationsSubj = function(relations, denotations) {
        if (!relations) return new Result();

        var objects = denotations ? denotations : [];

        return relations
            .reduce(
                _.partial(isContains, objects, 'subj'),
                new Result()
            );
    },
    validateModifications = function(modifications, denotations, relations) {
        if (!modifications) return new Result();

        var objects = _.union(denotations, relations);

        return modifications
            .reduce(
                _.partial(isContains, objects, 'obj'),
                new Result()
            );
    },
    validateAnnotation = function(annotation) {
        var resultDenotationHasLength = validateDenotationsHasLength(annotation.denotations),
            resultDenotationInText = validateDenotationsInText(
                resultDenotationHasLength.accept,
                annotation.text
            ),
            resultRelationObj = validateRelationsObj(
                annotation.relations,
                resultDenotationInText.accept
            ),
            resultRelationSubj = validateRelationsSubj(
                resultRelationObj.accept,
                resultDenotationInText.accept
            ),
            resultModification = validateModifications(
                annotation.modifications,
                resultDenotationInText.accept,
                resultRelationSubj.accept
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
