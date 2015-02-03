var EventEmitter = require('events').EventEmitter,
    ModelContainer = require('./ModelContainer'),
    ParagraphContainer = require('./ParagraphContainer'),
    SpanContainer = require('./SpanContainer'),
    EntityContainer = require('./EntityContainer'),
    Container = function(editor) {
        var emitter = new EventEmitter(),
            ModelContainerForAnnotationData = _.partial(ModelContainer, emitter),
            paragraph = new ParagraphContainer(editor, emitter),
            span = new SpanContainer(editor, emitter, paragraph),
            relation = new ModelContainerForAnnotationData('relation', function(relations) {
                relations = relations || [];
                return relations.map(function(r) {
                    return {
                        id: r.id,
                        type: r.pred,
                        subj: r.subj,
                        obj: r.obj
                    };
                });
            }),
            entity = new EntityContainer(editor, emitter, relation),
            modification = new ModelContainerForAnnotationData('modification', _.identity);

        return _.extend(emitter, {
            span: span,
            entity: entity,
            relation: relation,
            modification: modification,
            paragraph: paragraph,
            sourceDoc: ''
        });
    };

module.exports = Container;
