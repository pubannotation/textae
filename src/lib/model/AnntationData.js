var EntityContainer = require('./EntityContainer'),
    extendBindable = require('../util/extendBindable'),
    parseBaseText = function(dataStore, paragraph, eventEmitter, sourceDoc) {
        if (sourceDoc) {
            // Parse paragraphs
            paragraph.addSource(sourceDoc);

            eventEmitter.trigger('change-text', {
                sourceDoc: sourceDoc,
                paragraphs: paragraph.all()
            });

        } else {
            throw "read failed.";
        }
    },
    parseAnnotations = require('./parseAnnotations'),
    parseTracks = function(span, entity, relation, modification, annotation) {
        if (annotation.tracks) {
            annotation.tracks
                .forEach(function(track, i) {
                    var prefix = 'track' + (i + 1) + '_';
                    parseAnnotations(span, entity, relation, modification, track, prefix);
                });

            delete annotation.tracks;
        }
    },
    AnntationData = function(editor) {
        var originalData,
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
            ),
            setNewData = function(annotation) {
                parseBaseText(dataStore, paragraph, eventEmitter, annotation.text);
                parseTracks(span, entity, relation, modification, annotation);
                parseAnnotations(span, entity, relation, modification, annotation);

                originalData = annotation;

                // Expose values public.
                dataStore.sourceDoc = annotation.text;
                dataStore.config = annotation.config;
            },
            toDenotation = function() {
                return entity.all()
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
            },
            toRelation = function() {
                return relation.all().map(function(r) {
                    return {
                        id: r.id,
                        pred: r.type,
                        subj: r.subj,
                        obj: r.obj
                    };
                });
            },
            toJson = function() {
                return _.extend({}, originalData, {
                    'denotations': toDenotation(),
                    'relations': toRelation(),
                    'modifications': modification.all()
                });
            };

        return _.extend(dataStore, {
            reset: function(annotation) {
                try {
                    clearAnnotationData();
                    setNewData(annotation);
                    eventEmitter.trigger('all.change', eventEmitter);
                } catch (error) {
                    console.error(error, error.stack);
                }
            },
            toJson: function() {
                return JSON.stringify(toJson());
            },
            getModificationOf: function(objectId) {
                return modification.all()
                    .filter(function(m) {
                        return m.obj === objectId;
                    });
            }
        });
    };

module.exports = AnntationData;
