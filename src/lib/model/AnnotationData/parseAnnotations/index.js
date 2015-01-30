var parse = require('./parse'),
    translateDenotation = require('./translateDenotation'),
    translateRelations = require('./translateRelations'),
    translateModification = require('./translateModification'),
    parseAnnotations = function(span, entity, relation, modification, annotation, prefix) {
        parse([span, entity], _.partial(translateDenotation, prefix), annotation.denotations);
        parse([relation], _.partial(translateRelation, prefix), annotation.relations);
        parse([modification], _.partial(translateModification, prefix), annotation.modifications);
    };

module.exports = parseAnnotations;
