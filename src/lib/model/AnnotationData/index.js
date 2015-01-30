var EventEmitter = require('events').EventEmitter,
    ModelContainer = require('./ModelContainer'),
    ParagraphContainer = require('./ParagraphContainer'),
    SpanContainer = require('./SpanContainer'),
    EntityContainer = require('./EntityContainer'),
    parseAnnotation = require('./parseAnnotation'),
    parseBaseText = function(dataStore, paragraph, emitter, sourceDoc) {
        if (sourceDoc) {
            // Parse paragraphs
            paragraph.addSource(sourceDoc);

            emitter.emit('change-text', {
                sourceDoc: sourceDoc,
                paragraphs: paragraph.all()
            });

        } else {
            throw "read failed.";
        }
    },
    parseTracks = function(span, entity, relation, modification, annotation) {
        if (!annotation.tracks) return [];

        var tracks = annotation.tracks;
        delete annotation.tracks;

        return tracks
            .map(function(track, i) {
                var prefix = 'track' + (i + 1) + '_';

                return parseAnnotation(span, entity, relation, modification, track, prefix);
            });
    },
    AnntationData = function(editor) {
        var originalData,
            emitter = new EventEmitter(),
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
            modification = new ModelContainerForAnnotationData('modification', _.identity),
            dataStore = _.extend(emitter, {
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
                parseBaseText(dataStore, paragraph, emitter, annotation.text);

                var reject = {
                    tracks: parseTracks(span, entity, relation, modification, annotation),
                    annotation: parseAnnotation(span, entity, relation, modification, annotation)
                };

                originalData = annotation;

                // Expose values public.
                dataStore.sourceDoc = annotation.text;
                dataStore.config = annotation.config;

                return reject;
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
                    var reject = setNewData(annotation);
                    emitter.emit('all.change', emitter);

                    return reject;
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
