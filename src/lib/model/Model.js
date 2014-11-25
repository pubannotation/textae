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
    },
    AnntationData = function(editor) {
        var originalData,
            extendBindable = require('../util/extendBindable'),
            eventEmitter = extendBindable({}),
            ModelContainerForAnnotationData = _.partial(require('./ModelContainer'), eventEmitter),
            paragraph = require('./ParagraphContainer')(editor, eventEmitter),
            span = require('./SpanContainer')(editor, eventEmitter, paragraph),
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
            entity = new EntityContainer(editor, eventEmitter, relation),
            modification = new ModelContainerForAnnotationData('modification', _.identity),
            dataStore = _.extend(eventEmitter, {
                span: span,
                entity: entity,
                relation: relation,
                modification: modification,
                paragraph: paragraph,
                sourceDoc: ''
            }),
            clearAnnotationData = _.compose(
                dataStore.span.clear,
                dataStore.entity.clear,
                dataStore.relation.clear,
                dataStore.modification.clear,
                dataStore.paragraph.clear
            );

        return _.extend(dataStore, {
            reset: function() {
                var setOriginalData = function(annotation) {
                        originalData = annotation;

                        return annotation;
                    },
                    parseBaseText = function(dataStore, annotation) {
                        var sourceDoc = annotation.text;

                        if (sourceDoc) {
                            // Parse a source document.
                            dataStore.sourceDoc = sourceDoc;

                            // Parse paragraphs
                            paragraph.addSource(sourceDoc);

                            eventEmitter.trigger('change-text', {
                                sourceDoc: sourceDoc,
                                paragraphs: paragraph.all()
                            });
                        } else {
                            throw "read failed.";
                        }

                        return annotation;
                    },
                    translateDenotation = function(prefix, src) {
                        return _.extend({}, src, {
                            id: prefix + src.id
                        });
                    },
                    translateRelation = function(prefix, src) {
                        return _.extend({}, src, {
                            id: prefix + src.id,
                            subj: prefix + src.subj,
                            obj: prefix + src.obj
                        });
                    },
                    translateModification = function(prefix, src) {
                        return _.extend({}, src, {
                            id: prefix + src.id,
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
                    parseDenotations = function(dataStore, annotation, prefix) {
                        var denotations = doPrefix(annotation.denotations, translateDenotation, prefix);
                        dataStore.span.addSource(denotations);
                        dataStore.entity.addSource(denotations);
                        return annotation;
                    },
                    // Expected relations is an Array of object like { "id": "R1", "pred": "locatedAt", "subj": "E1", "obj": "T1" }.
                    parseRelations = function(dataStore, annotation, prefix) {
                        var relations = doPrefix(annotation.relations, translateRelation, prefix);
                        dataStore.relation.addSource(relations);
                        return annotation;
                    },
                    // Expected modifications is an Array of object like { "id": "M1", "pred": "Negation", "obj": "E1" }.
                    parseModifications = function(dataStore, annotation, prefix) {
                        var modifications = doPrefix(annotation.modifications, translateModification, prefix);
                        dataStore.modification.addSource(modifications);
                        return annotation;
                    },
                    parseAnnotations = function(dataStore, annotation, prefix) {
                        parseDenotations(dataStore, annotation, prefix);
                        parseRelations(dataStore, annotation, prefix);
                        parseModifications(dataStore, annotation, prefix);
                        return annotation;
                    },
                    parseTracks = function(dataStore, annotation) {
                        if (annotation.tracks) {
                            annotation.tracks
                                .forEach(function(track, i) {
                                    var prefix = 'track' + (i + 1) + '_';
                                    parseAnnotations(dataStore, track, prefix);
                                });

                            delete annotation.tracks;
                        }
                        return annotation;
                    },
                    parseConfig = function(dataStore, annotation) {
                        dataStore.config = annotation.config;

                        return annotation;
                    };

                return function(annotation) {
                    var setNewData = _.compose(
                        _.partial(parseConfig, dataStore),
                        _.partial(parseAnnotations, dataStore),
                        _.partial(parseTracks, dataStore),
                        _.partial(parseBaseText, dataStore),
                        setOriginalData);

                    try {
                        clearAnnotationData();
                        setNewData(annotation);
                        eventEmitter.trigger('all.change', eventEmitter);
                    } catch (error) {
                        console.error(error, error.stack);
                    }
                };
            }(),
            toJson: function() {
                var denotations = entity.all()
                    .filter(function(entity) {
                        // Span may be not exists, because crossing spans are not add to the dataStore.
                        return span.get(entity.span);
                    })
                    .map(function(entity) {
                        var currentSpan = span.get(entity.span);
                        return {
                            'id': entity.id,
                            'span': {
                                'begin': currentSpan.begin,
                                'end': currentSpan.end
                            },
                            'obj': entity.type
                        };
                    });

                return JSON.stringify($.extend(originalData, {
                    'denotations': denotations,
                    'relations': relation.all().map(function(r) {
                        return {
                            id: r.id,
                            pred: r.type,
                            subj: r.subj,
                            obj: r.obj
                        };
                    }),
                    'modifications': modification.all()
                }));
            },
            getModificationOf: function(objectId) {
                return modification.all()
                    .filter(function(m) {
                        return m.obj === objectId;
                    });
            }
        });
    };

module.exports = function(editor) {
    return {
        annotationData: new AnntationData(editor),
        // A contaier of selection state.
        selectionModel: require('./Selection')(['span', 'entity', 'relation'])
    };
};