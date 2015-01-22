var importSource = require('./importSource'),
    translateDenotation = require('./translateDenotation'),
    translateRelation = require('./translateRelation'),
    translateModification = require('./translateModification'),
    importAnnotations = function(span, entity, relation, modification, denotations, relations, modifications, prefix) {
        importSource([span, entity], _.partial(translateDenotation, prefix), denotations);
        importSource([relation], _.partial(translateRelation, prefix), relations);
        importSource([modification], _.partial(translateModification, prefix), modifications);
    };

module.exports = importAnnotations;
