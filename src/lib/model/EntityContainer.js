// Expected an entity like {id: "E21", span: "editor2__S50_54", type: "Protein"}.
var EntityContainer = function(editor, eventEmitter, relation) {
    var idFactory = require('../util/IdFactory')(editor),
        mappingFunction = function(denotations) {
            denotations = denotations || [];
            return denotations.map(function(entity) {
                return {
                    id: entity.id,
                    span: idFactory.makeSpanId(entity.span),
                    type: entity.obj,
                };
            });
        },
        entityContainer = require('./ModelContainer')(eventEmitter, 'entity', mappingFunction),
        api = _.extend(entityContainer, {
            add: _.compose(entityContainer.add, function(entity) {
                if (entity.span) return entity;
                throw new Error('entity has no span! ' + JSON.stringify(entity));
            }),
            assosicatedRelations: function(entityId) {
                return relation.all().filter(function(r) {
                    return r.obj === entityId || r.subj === entityId;
                }).map(function(r) {
                    return r.id;
                });
            }
        });

    return api;
};

module.exports = EntityContainer;
