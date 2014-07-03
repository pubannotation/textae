    var Model = function(idFactory) {
        // A span its range is coross over with other spans are not able to rendered.
        // Because spans are renderd with span tag. Html tags can not be cross over.
        var isBoundaryCrossingWithOtherSpans = function(span, candidateSpan) {
                return span.all().filter(function(existSpan) {
                    return (existSpan.begin < candidateSpan.begin && candidateSpan.begin < existSpan.end && existSpan.end < candidateSpan.end) ||
                        (candidateSpan.begin < existSpan.begin && existSpan.begin < candidateSpan.end && candidateSpan.end < existSpan.end);
                }).length > 0;
            },
            annotationData = function() {
                var originalData;

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

                var span = function() {
                    var spanContainer = {},
                        spanTopLevel = [],
                        innerAddSpan = function(span) {
                            var additionalPropertiesForSpan = {
                                isChildOf: function(maybeParent) {
                                    if (!maybeParent) return false;

                                    var id = idFactory.makeSpanId(maybeParent.begin, maybeParent.end);
                                    if (!spanContainer[id]) throw new Error('maybeParent is removed. ' + maybeParent.toStringOnlyThis());

                                    return maybeParent.begin <= span.begin && span.end <= maybeParent.end;
                                },
                                //for debug. print myself only.
                                toStringOnlyThis: function() {
                                    return "span " + this.begin + ":" + this.end + ":" + annotationData.sourceDoc.substring(this.begin, this.end);
                                },
                                //for debug. print with children.
                                toString: function(depth) {
                                    depth = depth || 1; //default depth is 1

                                    var childrenString = this.children && this.children.length > 0 ?
                                        "\n" + this.children.map(function(child) {
                                            return new Array(depth + 1).join("\t") + child.toString(depth + 1);
                                        }).join("\n") : "";

                                    return this.toStringOnlyThis() + childrenString;
                                },
                                // A big brother is brother node on a structure at rendered.
                                // There is no big brother if the span is first in a paragraph.
                                // Warning: parent is set at updateSpanTree, is not exists now.
                                getBigBrother: function() {
                                    var index;
                                    if (this.parent) {
                                        index = this.parent.children.indexOf(this);
                                        return index === 0 ? null : this.parent.children[index - 1];
                                    } else {
                                        index = annotationData.span.topLevel().indexOf(this);
                                        return index === 0 || annotationData.span.topLevel()[index - 1].paragraph !== this.paragraph ? null : annotationData.span.topLevel()[index - 1];
                                    }
                                },
                                // Get online for update is not grantieed.
                                getTypes: function() {
                                    var spanId = this.id;

                                    // Return an array of type like { id : "editor2__S1741_1755-1", name: "Negative_regulation", entities: ["E16", "E17"] }.
                                    return annotationData.entity.all()
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
                                },
                                getEntities: function() {
                                    return _.flatten(this.getTypes().map(function(type) {
                                        return type.entities;
                                    }));
                                }
                            };

                            // Ignore crossing spans.
                            if (annotationData.isBoundaryCrossingWithOtherSpans(span)) return;

                            var spanId = idFactory.makeSpanId(span.begin, span.end);

                            //add a span unless exists, because an annotations.json is defiend by entities so spans are added many times. 
                            if (!annotationData.span.get(spanId)) {
                                //a span is extended nondestructively to render.
                                var newSpan = $.extend({
                                        id: spanId,
                                        paragraph: paragraph.findParagraph(span),
                                    },
                                    span,
                                    additionalPropertiesForSpan);
                                spanContainer[spanId] = newSpan;
                                return newSpan;
                            }
                        },
                        spanComparator = function(a, b) {
                            return a.begin - b.begin || b.end - a.end;
                        },
                        updateSpanTree = function() {
                            // Sort id of spans by the position.
                            var sortedSpans = annotationData.span.all().sort(spanComparator);

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
                                        span.parent = null;
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

                            spanTopLevel = spanTree;
                        },
                        api = {
                            //expected span is like { "begin": 19, "end": 49 }
                            add: function(span) {
                                var newSpan = innerAddSpan(span);
                                updateSpanTree();
                                return annotationData.trigger('span.add', newSpan);
                            },
                            concat: function(spans) {
                                if (spans) {
                                    spans.forEach(innerAddSpan);
                                    updateSpanTree();
                                }
                            },
                            get: function(spanId) {
                                return spanContainer[spanId];
                            },
                            all: function() {
                                return $.map(spanContainer, function(span) {
                                    return span;
                                });
                            },
                            range: function(firstId, secondId) {
                                var first = spanContainer[firstId];
                                var second = spanContainer[secondId];

                                //switch if seconfId before firstId
                                if (spanComparator(first, second) > 0) {
                                    var temp = first;
                                    first = second;
                                    second = temp;
                                }

                                return Object.keys(spanContainer).filter(function(spanId) {
                                    var span = spanContainer[spanId];
                                    return first.begin <= span.begin && span.end <= second.end;
                                });
                            },
                            topLevel: function() {
                                return spanTopLevel;
                            },
                            multiEntities: function() {
                                return annotationData.span.all()
                                    .filter(function(span) {
                                        var multiEntitiesTypes = span.getTypes().filter(function(type) {
                                            return type.entities.length > 1;
                                        });

                                        return multiEntitiesTypes.length > 0;
                                    });
                            },
                            remove: function(spanId) {
                                var span = annotationData.span.get(spanId);
                                delete spanContainer[spanId];
                                updateSpanTree();

                                annotationData.trigger('span.remove', span);
                            },
                            clear: function() {
                                spanContainer = {};
                                spanTopLevel = [];
                            }
                        };

                    return api;
                }();

                var entity = function() {
                    var entityContainer = {},
                        getIds = function() {
                            return Object.keys(entityContainer);
                        },
                        getNewEntityId = _.partial(getNewId, 'E', getIds),
                        // Expected an entity like {id: "E21", span: "editor2__S50_54", type: "Protein"}.
                        add = function(entity) {
                            // Overwrite to revert
                            entity.id = entity.id || getNewEntityId();
                            entityContainer[entity.id] = entity;
                            return entity;
                        },
                        api = {
                            add: function(entity) {
                                return annotationData.trigger('entity.add', add(entity));
                            },
                            concat: function(entities) {
                                if (entities) entities.forEach(add);
                            },
                            get: function(entityId) {
                                return entityContainer[entityId];
                            },
                            all: function() {
                                return _.map(entityContainer, _.identity);
                            },
                            types: function() {
                                return annotationData.entity.all().map(function(entity) {
                                    return entity.type;
                                });
                            },
                            assosicatedRelations: function(entityId) {
                                return annotationData.relation.all().filter(function(r) {
                                    return r.obj === entityId || r.subj === entityId;
                                }).map(function(r) {
                                    return r.id;
                                });
                            },
                            changeType: function(entityId, newType) {
                                var entity = annotationData.entity.get(entityId);
                                entity.type = newType;
                                annotationData.trigger('entity.change', entity);
                                return entity;
                            },
                            remove: function(entityId) {
                                var entity = annotationData.entity.get(entityId);
                                if (entity) {
                                    delete entityContainer[entityId];
                                    annotationData.trigger('entity.remove', entity);
                                }
                                return entity;
                            },
                            clear: function() {
                                entityContainer = {};
                            }
                        };

                    return api;
                }();

                var relation = function() {
                    var relationContainer = {},
                        getIds = function() {
                            return Object.keys(relationContainer);
                        },
                        getNewRelationId = _.partial(getNewId, 'R', getIds),
                        add = function(relation) {
                            relation.id = relation.id || getNewRelationId();
                            relationContainer[relation.id] = relation;
                            return relation;
                        },
                        api = {
                            add: function(relation) {
                                return annotationData.trigger('relation.add', add(relation));
                            },
                            concat: function(relations) {
                                if (relations) relations.forEach(add);
                            },
                            get: function(relationId) {
                                return relationContainer[relationId];
                            },
                            all: function() {
                                return _.map(relationContainer, _.identity);
                            },
                            some: function() {
                                return _.some(relationContainer);
                            },
                            types: function() {
                                return Object.keys(relationContainer).map(function(key) {
                                    return relationContainer[key].pred;
                                });
                            },
                            changePredicate: function(relationId, predicate) {
                                relationContainer[relationId].pred = predicate;
                                annotationData.trigger('relation.change', relationContainer[relationId]);
                            },
                            remove: function(relationId) {
                                annotationData.trigger('relation.remove', relationContainer[relationId]);
                                delete relationContainer[relationId];
                            },
                            clear: function() {
                                relationContainer = {};
                            }
                        };

                    return api;
                }();

                var modification = function() {
                    var modificationContainer = [];
                    return {
                        concat: function(modifications) {
                            if (modifications) modificationContainer = modificationContainer.concat(modifications);
                        },
                        all: function() {
                            return modificationContainer;
                        },
                        clear: function() {
                            modificationContainer = [];
                        }
                    };
                }();

                var paragraph = function() {
                    var paragraphContainer;
                    return {
                        set: function(sourceDoc) {
                            var textLengthBeforeThisParagraph = 0;
                            paragraphContainer = sourceDoc.split("\n").map(function(p, index) {
                                var ret = {
                                    id: idFactory.makeParagraphId(index),
                                    begin: textLengthBeforeThisParagraph,
                                    end: textLengthBeforeThisParagraph + p.length,
                                };

                                textLengthBeforeThisParagraph += p.length + 1;
                                return ret;
                            });
                        },
                        get: function() {
                            return paragraphContainer;
                        },
                        //get the paragraph that span is belong to.
                        findParagraph: function(self) {
                            var match = paragraphContainer.filter(function(p) {
                                return self.begin >= p.begin && self.end <= p.end;
                            });
                            return match.length > 0 ? match[0] : null;
                        }
                    };
                }();

                var api = textAeUtil.extendBindable({
                    span: span,
                    entity: entity,
                    relation: relation,
                    modification: modification,
                    sourceDoc: '',
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
                                    paragraph.set(sourceDoc);

                                    api.trigger('change-text', {
                                        sourceDoc: sourceDoc,
                                        paragraphs: paragraph.get()
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
                                annotationData.span.clear();
                                annotationData.entity.clear();

                                if (denotations) {
                                    annotationData.span.concat(denotations.map(function(entity) {
                                        return entity.span;
                                    }));

                                    annotationData.entity.concat(denotations.map(function(entity) {
                                        return {
                                            id: entity.id,
                                            span: idFactory.makeSpanId(entity.span.begin, entity.span.end),
                                            type: entity.obj,
                                        };
                                    }));
                                }

                                return annotation;
                            },
                            // Expected relations is an Array of object like { "id": "R1", "pred": "locatedAt", "subj": "E1", "obj": "T1" }.
                            parseRelations = function(annotationData, annotation) {
                                var newRelations = annotation.relations;

                                annotationData.relation.clear();
                                annotationData.relation.concat(newRelations);

                                return annotation;
                            },
                            // Expected modifications is an Array of object like { "id": "M1", "pred": "Negation", "obj": "E1" }.
                            parseModifications = function(annotationData, annotation) {
                                var modifications = annotation.modifications;

                                annotationData.modification.clear();
                                annotationData.modification.concat(modifications);

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
                                api.trigger('all.change', annotationData);
                            } catch (error) {
                                alert(error);
                                throw error;
                            }
                        };
                    }(),
                    toJson: function() {
                        var denotations = annotationData.entity.all()
                            .filter(function(entity) {
                                // Span may be not exists, because crossing spans are not add to the annotationData.
                                return annotationData.span.get(entity.span);
                            })
                            .map(function(entity) {
                                var span = annotationData.span.get(entity.span);
                                return {
                                    'id': entity.id,
                                    'span': {
                                        'begin': span.begin,
                                        'end': span.end
                                    },
                                    'obj': entity.type
                                };
                            });

                        return JSON.stringify($.extend(originalData, {
                            'denotations': denotations,
                            'relations': annotationData.relation.all()
                        }));
                    },
                    isBoundaryCrossingWithOtherSpans: _.partial(isBoundaryCrossingWithOtherSpans, span)
                });

                return api;
            }(), // A contaier of selection state.
            selectionModel = function() {
                var IdContainer = function(kindName) {
                        var selected = {},
                            triggerChange = function() {
                                bindableKinds.trigger(kindName + '.change');
                            };

                        var api = {
                            name: kindName,
                            add: function(id) {
                                selected[id] = id;
                                bindableKinds.trigger(kindName + '.select', id);
                                triggerChange();
                            },
                            all: function() {
                                return _.toArray(selected);
                            },
                            has: function(id) {
                                return _.contains(selected, id);
                            },
                            some: function() {
                                return _.some(selected);
                            },
                            single: function() {
                                var array = api.all();
                                return array.length === 1 ? array[0] : null;
                            },
                            toggle: function(id) {
                                if (api.has(id)) {
                                    api.remove(id);
                                } else {
                                    api.add(id);
                                }
                            },
                            remove: function(id) {
                                delete selected[id];
                                bindableKinds.trigger(kindName + '.deselect', id);
                                triggerChange();
                            },
                            clear: function() {
                                _.each(api.all(), api.remove);
                                selected = {};
                                triggerChange();
                            }
                        };

                        return api;
                    },
                    clearAll = function(kindList) {
                        _.each(kindList, function(kind) {
                            kind.clear();
                        });
                    },
                    someAll = function(kindList) {
                        return kindList
                            .map(function(kind) {
                                return kind.some();
                            })
                            .reduce(function(a, b) {
                                return a || b;
                            });

                    };

                var kindList = ['span', 'entity', 'relation']
                    .map(function(kind) {
                        return new IdContainer(kind);
                    });

                var bindableKinds = textAeUtil.extendBindable(_.extend(kindList.reduce(function(a, b) {
                    a[b.name] = b;
                    return a;
                }, {}), {
                    clear: _.partial(clearAll, kindList),
                    some: _.partial(someAll, kindList)
                }));

                return bindableKinds;
            }();

        return {
            annotationData: annotationData,
            selectionModel: selectionModel,
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
                    return annotationData.span.all().filter(function(existSpan) {
                        return existSpan.begin === candidateSpan.begin && existSpan.end === candidateSpan.end;
                    }).length > 0;
                };

                return getSpansTheirStringIsSameWith(originSpan).filter(function(span) {
                    return !isOriginSpan(span) && isWord(span) && !isAlreadySpaned(span) && !annotationData.isBoundaryCrossingWithOtherSpans(span);
                });
            }
        };
    };