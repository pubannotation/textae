// Expected an entity like {id: "E21", span: "editor2__S50_54", type: "Protein"}.
var EntityContainer = function(editor, annotationDataApi) {
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
            entityContainer = require('./ModelContainer')(annotationDataApi, 'entity', mappingFunction),
            api = _.extend(entityContainer, {
                add: _.compose(entityContainer.add, function(entity) {
                    if (entity.span) return entity;
                    throw new Error('entity has no span! ' + JSON.stringify(entity));
                }),
                assosicatedRelations: function(entityId) {
                    return annotationDataApi.relation.all().filter(function(r) {
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
            annotationDataApi = extendBindable({}),
            ModelContainerForAnnotationData = _.partial(require('./ModelContainer'), annotationDataApi),
            paragraph = require('./ParagraphContainer')(editor, annotationDataApi),
            span = require('./SpanContainer')(editor, annotationDataApi, paragraph),
            entity = new EntityContainer(editor, annotationDataApi),
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
            modification = new ModelContainerForAnnotationData('modification', _.identity);

        return _.extend(annotationDataApi, {
            span: span,
            entity: entity,
            relation: relation,
            modification: modification,
            paragraph: paragraph,
            sourceDoc: '',
            reset: function() {
                var setOriginalData = function(annotation) {
                        originalData = annotation;

                        return annotation;
                    },
                    parseBaseText = function(annotationData, annotation) {
                        var sourceDoc = annotation.text;

                        if (sourceDoc) {
                            // Parse a source document.
                            annotationData.sourceDoc = sourceDoc;

                            // Parse paragraphs
                            paragraph.setSource(sourceDoc);

                            annotationDataApi.trigger('change-text', {
                                sourceDoc: sourceDoc,
                                paragraphs: paragraph.all()
                            });
                        } else {
                            throw "read failed.";
                        }

                        return annotation;
                    },
                    // Expected denotations is an Array of object like { "id": "T1", "span": { "begin": 19, "end": 49 }, "obj": "Cell" }.
                    parseDenotations = function(annotationData, annotation) {
                        if (annotation.tracks) {
                            var first = _.first(annotation.tracks).denotations;
                            annotationData.span.setSource(first);
                            annotationData.entity.setSource(first);

                            _.rest(annotation.tracks)
                                .map(function(tracks) {
                                    return tracks.denotations;
                                }).forEach(function(denotations) {
                                    annotationData.span.concat(denotations);
                                    annotationData.entity.concat(denotations);
                                });
                        } else {
                            annotationData.span.setSource(annotation.denotations);
                            annotationData.entity.setSource(annotation.denotations);
                        }
                        return annotation;
                    },
                    // Expected relations is an Array of object like { "id": "R1", "pred": "locatedAt", "subj": "E1", "obj": "T1" }.
                    parseRelations = function(annotationData, annotation) {
                        annotationData.relation.setSource(annotation.relations);

                        return annotation;
                    },
                    // Expected modifications is an Array of object like { "id": "M1", "pred": "Negation", "obj": "E1" }.
                    parseModifications = function(annotationData, annotation) {
                        annotationData.modification.setSource(annotation.modifications);

                        return annotation;
                    },
                    parseConfig = function(annotationData, annotation) {
                        annotationData.config = annotation.config;

                        return annotation;
                    };

                return function(annotation) {
                    var setNewData = _.compose(
                        _.partial(parseConfig, this),
                        _.partial(parseModifications, this),
                        _.partial(parseRelations, this),
                        _.partial(parseDenotations, this),
                        _.partial(parseBaseText, this),
                        setOriginalData);

                    try {
                        setNewData(annotation);
                        annotationDataApi.trigger('all.change', annotationDataApi);
                    } catch (error) {
                        alert(error);
                        throw error;
                    }
                };
            }(),
            toJson: function() {
                var denotations = entity.all()
                    .filter(function(entity) {
                        // Span may be not exists, because crossing spans are not add to the annotationData.
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
            isBoundaryCrossingWithOtherSpans: _.partial(require('./isBoundaryCrossingWithOtherSpans'), span.all),
            getModificationOf: function(objectId) {
                return modification.all()
                    .filter(function(m) {
                        return m.obj === objectId;
                    });
            }
        });
    };

module.exports = function(editor) {
    var annotationData = new AnntationData(editor),
        getReplicationSpans = function(annotationData, originSpan, spanConfig) {
            // Get spans their stirng is same with the originSpan from sourceDoc.
            var getSpansTheirStringIsSameWith = function(originSpan) {
                var getNextStringIndex = String.prototype.indexOf.bind(annotationData.sourceDoc, annotationData.sourceDoc.substring(originSpan.begin, originSpan.end));
                var length = originSpan.end - originSpan.begin;

                var findStrings = [];
                var offset = 0;
                for (var index = getNextStringIndex(offset); index !== -1; index = getNextStringIndex(offset)) {
                    findStrings.push({
                        begin: index,
                        end: index + length
                    });

                    offset = index + length;
                }
                return findStrings;
            };

            // The candidateSpan is a same span when begin is same.
            // Because string of each others are same. End of them are same too.
            var isOriginSpan = function(candidateSpan) {
                return candidateSpan.begin === originSpan.begin;
            };

            // The preceding charactor and the following of a word charactor are delimiter.
            // For example, 't' ,a part of 'that', is not same with an origin span when it is 't'. 
            var isWord = function(candidateSpan) {
                var precedingChar = annotationData.sourceDoc.charAt(candidateSpan.begin - 1);
                var followingChar = annotationData.sourceDoc.charAt(candidateSpan.end);

                return spanConfig.isDelimiter(precedingChar) && spanConfig.isDelimiter(followingChar);
            };

            // Is the candidateSpan is spaned already?
            var isAlreadySpaned = function(candidateSpan) {
                return annotationData.span.all().filter(function(existSpan) {
                    return existSpan.begin === candidateSpan.begin && existSpan.end === candidateSpan.end;
                }).length > 0;
            };

            return getSpansTheirStringIsSameWith(originSpan).filter(function(span) {
                return !isOriginSpan(span) && isWord(span) && !isAlreadySpaned(span) && !annotationData.isBoundaryCrossingWithOtherSpans(span);
            });
        };

    return {
        annotationData: annotationData,
        // A contaier of selection state.
        selectionModel: require('./Selection')(['span', 'entity', 'relation']),
        getReplicationSpans: _.partial(getReplicationSpans, annotationData)
    };
};