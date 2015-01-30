var parse = require('./parse'),
    translateDenotation = require('./translateDenotation'),
    translateRelations = require('./translateRelations'),
    translateModification = require('./translateModification'),
    parseAnnotations = function(span, entity, relation, modification, denotations, relations, modifications, prefix) {
        parse([span, entity], _.partial(translateDenotation, prefix), denotations);
        parse([relation], _.partial(translateRelation, prefix), relations);
        parse([modification], _.partial(translateModification, prefix), modifications);
    };

module.exports = parseAnnotations;
