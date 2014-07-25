module.exports = function(idFactory) {
    // A span its range is coross over with other spans are not able to rendered.
    // Because spans are renderd with span tag. Html tags can not be cross over.
    var isBoundaryCrossingWithOtherSpans = function(getAll, candidateSpan) {
            return getAll().filter(function(existSpan) {
                return (existSpan.begin < candidateSpan.begin && candidateSpan.begin < existSpan.end && existSpan.end < candidateSpan.end) ||
                    (candidateSpan.begin < existSpan.begin && existSpan.begin < candidateSpan.end && candidateSpan.end < existSpan.end);
            }).length > 0;
        },
        extendBindable = require('../util/extendBindable'),
        annotationData = function() {
            var originalData;

            var createId = function(prefix, getIdsFunction) {
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

            var ModelContainer = function(prefix, mappingFunction) {
                var contaier = {},
                    getIds = function() {
                        return Object.keys(contaier);
                    },
                    getNewId = _.partial(createId, prefix ? prefix.charAt(0).toUpperCase() : '', getIds),
                    add = function(model) {
                        // Overwrite to revert
                        model.id = model.id || getNewId();
                        contaier[model.id] = model;
                        return model;
                    },
                    concat = function(collection) {
                        if (collection) collection.forEach(add);
                    },
                    get = function(id) {
                        return contaier[id];
                    },
                    all = function() {
                        return _.map(contaier, _.identity);
                    },
                    clear = function() {
                        contaier = {};
                    };

                return {
                    setSource: function(source) {
                        if (!_.isFunction(mappingFunction)) {
                            throw new Error('Set the mappingFunction by the constructor to use the method "ModelContainer.setSource".');
                        }

                        clear();
                        concat(mappingFunction(source));
                    },
                    add: function(model, doAfter) {
                        var newModel = add(model);
                        if (_.isFunction(doAfter)) doAfter();
                        return annotationData.trigger(prefix + '.add', newModel);
                    },
                    get: get,
                    all: all,
                    some: function() {
                        return _.some(contaier);
                    },
                    types: function() {
                        return all().map(function(model) {
                            return model.type;
                        });
                    },
                    changeType: function(id, newType) {
                        var model = get(id);
                        model.type = newType;
                        annotationData.trigger(prefix + '.change', model);
                        return model;
                    },
                    remove: function(id) {
                        var model = contaier[id];
                        if (model) {
                            delete contaier[id];
                            annotationData.trigger(prefix + '.remove', model);
                        }
                        return model;
                    },
                    clear: clear
                };
            };

            var span = function() {
                var toSpanModel = function() {
                        var spanExtension = {
                            isChildOf: function(maybeParent) {
                                if (!maybeParent) return false;

                                var id = idFactory.makeSpanId(maybeParent.begin, maybeParent.end);
                                if (!spanContainer.get(id)) throw new Error('maybeParent is removed. ' + maybeParent.toStringOnlyThis());

                                return maybeParent.begin <= this.begin && this.end <= maybeParent.end;
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
                                    index = spanTopLevel.indexOf(this);
                                    return index === 0 || spanTopLevel[index - 1].paragraph !== this.paragraph ? null : spanTopLevel[index - 1];
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

                        return function(span) {
                            return $.extend({},
                                span, {
                                    id: idFactory.makeSpanId(span.begin, span.end),
                                    paragraph: paragraph.getBelongingTo(span),
                                },
                                spanExtension);
                        };
                    }(),
                    mappingFunction = function(denotations) {
                        denotations = denotations || [];
                        return denotations.map(function(entity) {
                                return entity.span;
                            }).map(toSpanModel)
                            .filter(function(span, index, array) {
                                return !isBoundaryCrossingWithOtherSpans(
                                    function() {
                                        return array.slice(0, index - 1);
                                    }, span);
                            });
                    },
                    spanContainer = new ModelContainer('span', mappingFunction),
                    spanTopLevel = [],
                    adopt = function(parent, span) {
                        parent.children.push(span);
                        span.parent = parent;
                    },
                    getParet = function(parent, span) {
                        if (span.isChildOf(parent)) {
                            return parent;
                        } else {
                            if (parent.parent) {
                                return getParet(parent.parent, span);
                            } else {
                                return null;
                            }
                        }
                    },
                    updateSpanTree = function() {
                        // Sort id of spans by the position.
                        var sortedSpans = spanContainer.all().sort(spanComparator);

                        // the spanTree has parent-child structure.
                        var spanTree = [];

                        sortedSpans
                            .map(function(span, index, array) {
                                return $.extend(span, {
                                    // Reset parent
                                    parent: null,
                                    // Reset children
                                    children: [],
                                    // Order by position
                                    left: index !== 0 ? array[index - 1] : null,
                                    right: index !== array.length - 1 ? array[index + 1] : null,
                                });
                            })
                            .forEach(function(span) {
                                if (span.left) {
                                    var parent = getParet(span.left, span);
                                    if (parent) {
                                        adopt(parent, span);
                                    } else {
                                        spanTree.push(span);
                                    }
                                } else {
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
                    spanComparator = function(a, b) {
                        return a.begin - b.begin || b.end - a.end;
                    },
                    api = {

                        //expected span is like { "begin": 19, "end": 49 }
                        add: function(span) {
                            if (span)
                                return spanContainer.add(toSpanModel(span), updateSpanTree);
                            throw new Error('span is undefined.');
                        },
                        setSource: function(spans) {
                            spanContainer.setSource(spans);
                            updateSpanTree();
                        },
                        get: function(spanId) {
                            return spanContainer.get(spanId);
                        },
                        all: spanContainer.all,
                        range: function(firstId, secondId) {
                            var first = spanContainer.get(firstId);
                            var second = spanContainer.get(secondId);

                            //switch if seconfId before firstId
                            if (spanComparator(first, second) > 0) {
                                var temp = first;
                                first = second;
                                second = temp;
                            }

                            return spanContainer.all()
                                .filter(function(span) {
                                    return first.begin <= span.begin && span.end <= second.end;
                                })
                                .map(function(span) {
                                    return span.id;
                                });
                        },
                        topLevel: function() {
                            return spanTopLevel;
                        },
                        multiEntities: function() {
                            return spanContainer.all()
                                .filter(function(span) {
                                    var multiEntitiesTypes = span.getTypes().filter(function(type) {
                                        return type.entities.length > 1;
                                    });

                                    return multiEntitiesTypes.length > 0;
                                });
                        },
                        remove: spanContainer.remove,
                        clear: function() {
                            spanContainer.clear();
                            spanTopLevel = [];
                        }
                    };


                return api;
            }();

            // Expected an entity like {id: "E21", span: "editor2__S50_54", type: "Protein"}.
            var entity = function() {
                var mappingFunction = function(denotations) {
                        denotations = denotations || [];
                        return denotations.map(function(entity) {
                            return {
                                id: entity.id,
                                span: idFactory.makeSpanId(entity.span.begin, entity.span.end),
                                type: entity.obj,
                            };
                        });
                    },
                    entityContainer = new ModelContainer('entity', mappingFunction),
                    api = _.extend(entityContainer, {
                        add: _.compose(entityContainer.add, function(entity) {
                            if (entity.span) return entity;
                            throw new Error('entity has no span! ' + JSON.stringify(entity));
                        }),
                        assosicatedRelations: function(entityId) {
                            return annotationData.relation.all().filter(function(r) {
                                return r.obj === entityId || r.subj === entityId;
                            }).map(function(r) {
                                return r.id;
                            });
                        }
                    });

                return api;
            }();

            var relation = new ModelContainer('relation', function(relations) {
                relations = relations || [];
                return relations.map(function(r) {
                    return {
                        id: r.id,
                        type: r.pred,
                        subj: r.subj,
                        obj: r.obj
                    };
                });
            });

            var modification = new ModelContainer('modification', _.identity);

            var paragraph = function() {
                var mappingFunction = function(sourceDoc) {
                        sourceDoc = sourceDoc || [];
                        var textLengthBeforeThisParagraph = 0;

                        return sourceDoc.split("\n")
                            .map(function(p, index) {
                                var ret = {
                                    id: idFactory.makeParagraphId(index),
                                    begin: textLengthBeforeThisParagraph,
                                    end: textLengthBeforeThisParagraph + p.length,
                                };

                                textLengthBeforeThisParagraph += p.length + 1;
                                return ret;
                            });
                    },
                    paragraphContainer = new ModelContainer('paragraph', mappingFunction),
                    api = _.extend(paragraphContainer, {
                        //get the paragraph that span is belong to.
                        getBelongingTo: function(span) {
                            var match = paragraphContainer.all().filter(function(p) {
                                return span.begin >= p.begin && span.end <= p.end;
                            });

                            if (match.length === 0) {
                                throw new Error('span should belong to any paragraph.');
                            } else {
                                return match[0];
                            }
                        }
                    });

                return api;
            }();

            var api = extendBindable({
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

                                api.trigger('change-text', {
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
                            var denotations = annotation.denotations;
                            annotationData.span.setSource(denotations);
                            annotationData.entity.setSource(denotations);

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
                        'relations': annotationData.relation.all().map(function(r) {
                            return {
                                id: r.id,
                                pred: r.type,
                                subj: r.subj,
                                obj: r.obj
                            };
                        }),
                        'modifications': annotationData.modification.all()
                    }));
                },
                isBoundaryCrossingWithOtherSpans: _.partial(isBoundaryCrossingWithOtherSpans, span.all),
                getModificationOf: function(objectId) {
                    return modification.all()
                        .filter(function(m) {
                            return m.obj === objectId;
                        });
                }
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

            var bindableKinds = extendBindable(_.extend(kindList.reduce(function(a, b) {
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