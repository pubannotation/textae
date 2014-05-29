    var makeModel = function(idFactory) {
        var annotationData = function() {
            var originalData;
            var spanContainer = {};
            var entities = {};
            var sortedSpanIds = null;

            var updateSpanTree = function() {
                // Sort id of spans by the position.
                var sortedSpans = annotationData.getAllSpan().sort(function(a, b) {
                    return a.begin - b.begin || b.end - a.end;
                });

                // the spanTree has parent-child structure.
                var spanTree = [];
                sortedSpans.map(function(span, index, array) {
                    return $.extend(span, {
                        // Reset children
                        children: [],
                        // Order by position
                        left: index !== 0 ? array[index - 1] : null,
                        right: index !== array.length - 1 ? array[index + 1] : null,
                    });
                })
                .forEach(function(span) {
                    // Find the parent of this span.
                    var lastPushedSpan = spanTree[spanTree.length - 1];
                    if (span.isChildOf(span.left)) {
                        // The left span is the parent.
                        // The left span may be the parent of a current span because span id is sorted.
                        span.left.children.push(span);
                        span.parent = span.left;
                    } else if (span.left && span.isChildOf(span.left.parent)) {
                        // The left span is the bigBrother.
                        // The parent of the left span may be the parent of a current span.
                        span.left.parent.children.push(span);
                        span.parent = span.left.parent;
                    } else if (span.isChildOf(lastPushedSpan)) {
                        // The last pushed span is the parent.
                        // This occur when prev node is also a child of last pushed span.
                        lastPushedSpan.children.push(span);
                        span.parent = lastPushedSpan;
                    } else {
                        // A current span has no parent.
                        spanTree.push(span);
                    }
                });

                //this for debug.
                spanTree.toString = function() {
                    return this.map(function(span) {
                        return span.toString();
                    }).join("\n");
                };
                // console.log(spanTree.toString());

                sortedSpanIds = sortedSpans.map(function(span) {
                    return span.id;
                });
                annotationData.spansTopLevel = spanTree;
            };

            var getNewId = function(prefix, getIdsFunction) {
                var ids = getIdsFunction()
                    .filter(function(id) {
                        return id[0] === prefix;
                    })
                    .map(function(id) {
                        return id.slice(1);
                    });

                // The Math.max retrun -Infinity when the second argument array is empty.
                return prefix + (ids.length === 0 ? 1 : Math.max.apply(null, ids) + 1);
            };

            var getNewEntityId = _.partial(getNewId, 'E', function() {
                return Object.keys(entities);
            });

            var getRelationIds = function() {
                return Object.keys(annotationData.relations);
            };

            var getNewRelationId = _.partial(getNewId, 'R', getRelationIds);

            var innerAddSpan = function(span) {
                var additionalPropertiesForSpan = {
                    isChildOf: function(maybeParent) {
                        return maybeParent && maybeParent.begin <= span.begin && span.end <= maybeParent.end;
                    },
                    //for debug. print myself only.
                    toStringOnlyThis: function() {
                        return "span " + this.begin + ":" + this.end + ":" + annotationData.sourceDoc.substring(this.begin, this.end);
                    },
                    //for debug. print with children.
                    toString: function(depth) {
                        depth = depth || 1; //default depth is 1

                        var childrenString = this.children.length > 0 ?
                            "\n" + this.children.map(function(child) {
                                return new Array(depth + 1).join("\t") + child.toString(depth + 1);
                            }).join("\n") : "";

                        return this.toStringOnlyThis() + childrenString;
                    },
                    // A big brother is brother node on a structure at rendered.
                    // There is no big brother if the span is first in a paragrpah.
                    // Warning: parent is set at updateSpanTree, is not exists now.
                    getBigBrother: function() {
                        var index;
                        if (this.parent) {
                            index = this.parent.children.indexOf(this);
                            return index === 0 ? null : this.parent.children[index - 1];
                        } else {
                            index = annotationData.spansTopLevel.indexOf(this);
                            return index === 0 || annotationData.spansTopLevel[index - 1].paragraph !== this.paragraph ? null : annotationData.spansTopLevel[index - 1];
                        }
                    },
                    // Get online for update is not grantieed.
                    getTypes: function() {
                        var spanId = this.id;

                        // Return an array of type like { id : "editor2__S1741_1755-1", name: "Negative_regulation", entities: ["E16", "E17"] }.
                        return Object.keys(entities)
                            .map(annotationData.getEntity)
                            .filter(function(entity) {
                                return spanId === entity.span;
                            })
                            .reduce(function(a, b) {
                                var typeId = idFactory.makeTypeId(b.span, b.type);

                                var type = a.filter(function(type) {
                                    return type.id === typeId;
                                });

                                if (type.length > 0) {
                                    type[0].entities.push(b.id);
                                } else {
                                    a.push({
                                        id: typeId,
                                        name: b.type,
                                        entities: [b.id]
                                    });
                                }
                                return a;
                            }, []);
                    }
                };

                //get the paragraph that span is belong to.
                var findParagraph = function(self) {
                    var match = annotationData.paragraphsArray.filter(function(p) {
                        return self.begin >= p.begin && self.end <= p.end;
                    });
                    return match.length > 0 ? match[0] : null;
                };

                var spanId = idFactory.makeSpanId(span.begin, span.end);

                //add a span unless exists, because an annotations.json is defiend by entities so spans are added many times. 
                if (!annotationData.getSpan(spanId)) {
                    //a span is exteded nondestructively to render.
                    spanContainer[spanId] = $.extend({
                            id: spanId,
                            paragraph: findParagraph(span),
                        },
                        span,
                        additionalPropertiesForSpan);
                }
            };

            return {
                sourceDoc: '',
                spansTopLevel: [],
                relations: {},
                modifications: [],
                reset: function() {
                    var setOriginalData = function(annotation) {
                            originalData = annotation;

                            return annotation;
                        },
                        parseBaseText = function(annotationData, annotation) {
                            var sourceDoc = annotation.text;
                            // Validate

                            if (sourceDoc) {
                                // Parse a souce document.
                                annotationData.sourceDoc = sourceDoc;

                                // Parse paragraphs
                                var textLengthBeforeThisParagraph = 0;
                                annotationData.paragraphsArray = sourceDoc.split("\n").map(function(p, index) {
                                    var ret = {
                                        id: idFactory.makeParagraphId(index),
                                        begin: textLengthBeforeThisParagraph,
                                        end: textLengthBeforeThisParagraph + p.length,
                                    };

                                    textLengthBeforeThisParagraph += p.length + 1;
                                    return ret;
                                });
                            } else {
                                throw "read failed.";
                            }

                            return annotation;
                        },
                        // Expected denotations is an Array of object like { "id": "T1", "span": { "begin": 19, "end": 49 }, "obj": "Cell" }.
                        parseDenotations = function(annotationData, annotation) {
                            var denotations = annotation.denotations;

                            // Init
                            spanContainer = {};
                            entities = {};

                            if (denotations) {
                                denotations.forEach(function(entity) {
                                    innerAddSpan(entity.span);
                                    annotationData.addEntity({
                                        id: entity.id,
                                        span: idFactory.makeSpanId(entity.span.begin, entity.span.end),
                                        type: entity.obj,
                                    });
                                });
                            }

                            updateSpanTree();

                            return annotation;
                        },
                        // Expected relations is an Array of object like { "id": "R1", "pred": "locatedAt", "subj": "E1", "obj": "T1" }.
                        parseRelations = function(annotationData, annotation) {
                            var relations = annotation.relations;

                            annotationData.relations = relations ? relations.reduce(function(a, b) {
                                a[b.id] = $.extend({}, b);
                                return a;
                            }, {}) : {};

                            return annotation;
                        },
                        // Expected modifications is an Array of object like { "id": "M1", "pred": "Negation", "obj": "E1" }.
                        parseModifications = function(annotationData, annotation) {
                            var modifications = annotation.modifications;

                            annotationData.modifications = modifications ? modifications : [];

                            return annotation;
                        };

                    return function(annotation) {
                        var setNewData = _.compose(
                            _.partial(parseModifications, this),
                            _.partial(parseRelations, this),
                            _.partial(parseDenotations, this),
                            _.partial(parseBaseText, this),
                            setOriginalData);

                        try {
                            setNewData(annotation);
                        } catch (error) {
                            alert(error);
                        }
                    };
                }(),
                //expected span is like { "begin": 19, "end": 49 }
                addSpan: function(span) {
                    innerAddSpan(span);
                    updateSpanTree();
                },
                removeSpan: function(spanId) {
                    delete spanContainer[spanId];
                    updateSpanTree();
                },
                getSpan: function(spanId) {
                    return spanContainer[spanId];
                },
                getRangeOfSpan: function(firstId, secondId) {
                    var first = spanContainer[firstId];
                    var second = spanContainer[secondId];

                    return Object.keys(spanContainer).filter(function(spanId) {
                        var span = spanContainer[spanId];
                        return first.begin <= span.begin && span.end <= second.end;
                    });
                },
                getAllSpan: function() {
                    return $.map(spanContainer, function(span) {
                        return span;
                    });
                },
                // Expected an entity like {id: "E21", span: "editor2__S50_54", type: "Protein"}.
                addEntity: function(entity) {
                    entities[entity.id] = entity;
                },
                getEntity: function(entityId) {
                    return entities[entityId];
                },
                removeEnitity: function(entityId) {
                    var entity = annotationData.getEntity(entityId);
                    if (entity) {
                        delete entities[entityId];
                    }
                    return entity;
                },
                getEntityTypes: function() {
                    return Object.keys(entities).map(function(key) {
                        return annotationData.getEntity(key).type;
                    });
                },
                getRelationTypes: function() {
                    return Object.keys(annotationData.relations).map(function(key) {
                        return annotationData.relations[key].pred;
                    });
                },
                getAssosicatedRelations: function(entityId) {
                    return Object.keys(annotationData.relations).filter(function(key) {
                        var r = annotationData.relations[key];
                        return r.obj === entityId || r.subj === entityId;
                    });
                },
                getNewEntityId: getNewEntityId,
                getRelationIds: getRelationIds,
                getNewRelationId: getNewRelationId,
                toJson: function() {
                    var denotations = Object.keys(entities)
                        .map(annotationData.getEntity)
                        .map(function(entity) {
                            var span = annotationData.getSpan(entity.span);
                            return {
                                'id': entity.id,
                                'span': {
                                    'begin': span.begin,
                                    'end': span.end
                                },
                                'obj': entity.type
                            };
                        });

                    var relations = Object.keys(annotationData.relations).map(function(relationId) {
                        return annotationData.relations[relationId];
                    });

                    return JSON.stringify({
                        annotations: $.extend(originalData, {
                            'denotations': denotations,
                            'relations': relations
                        })
                    });
                }
            };
        }();

        return {
            annotationData: annotationData,
            getReplicationSpans: function(originSpan, spanConfig) {
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
                    return annotationData.getAllSpan().filter(function(existSpan) {
                        return existSpan.begin === candidateSpan.begin && existSpan.end === candidateSpan.end;
                    }).length > 0;
                };

                // A span its range is coross over with other spans are not able to rendered.
                // Because spans are renderd with span tag. Html tags can not be cross over.
                var isBoundaryCrossingWithOtherSpans = function(candidateSpan) {
                    return annotationData.getAllSpan().filter(function(existSpan) {
                        return (existSpan.begin < candidateSpan.begin && candidateSpan.begin < existSpan.end && existSpan.end < candidateSpan.end) ||
                            (candidateSpan.begin < existSpan.begin && existSpan.begin < candidateSpan.end && candidateSpan.end < existSpan.end);
                    }).length > 0;
                };

                return getSpansTheirStringIsSameWith(originSpan).filter(function(span) {
                    return !isOriginSpan(span) && isWord(span) && !isAlreadySpaned(span) && !isBoundaryCrossingWithOtherSpans(span);
                });
            }
        };
    };