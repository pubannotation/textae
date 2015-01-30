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
        var resultRelationObj = validateRelationsObj(
                annotation.relations,
                annotation.denotations
            ),
            resultRelationSubj = validateRelationsSubj(
                resultRelationObj.accept,
                annotation.denotations
            ),
            resultModification = validateModifications(
                annotation.modifications,
                annotation.denotations,
                resultRelationSubj.accept
            );

        return {
            accept: {
                denotation: annotation.denotations,
                relation: resultRelationSubj.accept,
                modification: resultModification.accept
            },
            reject: {
                denotation: [],
                relationObj: resultRelationObj.reject,
                relationSubj: resultRelationSubj.reject,
                modification: resultModification.reject
            }
        };
    };

module.exports = validateAnnotation;
