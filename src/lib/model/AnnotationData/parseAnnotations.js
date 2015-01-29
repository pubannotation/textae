var setIdPrefixIfExist = function(src, prefix) {
        // An id will be generated if id is null.
        // But an undefined is convert to string as 'undefined' when it add to any string.
        return src.id ? prefix + src.id : null;
    },
    translateDenotation = function(prefix, src) {
        return _.extend({}, src, {
            // Do not convert  string unless id.
            id: setIdPrefixIfExist(src, prefix)
        });
    },
    translateRelation = function(prefix, src) {
        return _.extend({}, src, {
            id: setIdPrefixIfExist(src, prefix),
            subj: prefix + src.subj,
            obj: prefix + src.obj
        });
    },
    translateModification = function(prefix, src) {
        return _.extend({}, src, {
            id: setIdPrefixIfExist(src, prefix),
            obj: prefix + src.obj
        });
    },
    doPrefix = function(origin, translater, prefix) {
        prefix = prefix || '';
        return origin && translater ?
            origin.map(_.partial(translater, prefix)) :
            origin;
    },
    // Expected denotations is an Array of object like { "id": "T1", "span": { "begin": 19, "end": 49 }, "obj": "Cell" }.
    parseDenotations = function(span, entity, newDenotations, prefix) {
        var source = doPrefix(newDenotations, translateDenotation, prefix);
        span.addSource(source);
        entity.addSource(source);
    },
    // Expected relations is an Array of object like { "id": "R1", "pred": "locatedAt", "subj": "E1", "obj": "T1" }.
    parseRelations = function(relation, newRelations, prefix) {
        var source = doPrefix(newRelations, translateRelation, prefix);
        relation.addSource(source);
    },
    // Expected modifications is an Array of object like { "id": "M1", "pred": "Negation", "obj": "E1" }.
    parseModifications = function(modification, newModifications, prefix) {
        var source = doPrefix(newModifications, translateModification, prefix);
        modification.addSource(source);
    },
    parseAnnotations = function(span, entity, relation, modification, annotation, prefix) {
        parseDenotations(span, entity, annotation.denotations, prefix);
        parseRelations(relation, annotation.relations, prefix);
        parseModifications(modification, annotation.modifications, prefix);
    };

module.exports = parseAnnotations;
