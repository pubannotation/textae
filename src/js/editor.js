    var editor = function() {
        //cursor
        var cursor = function(editor) {
            var wait = function() {
                editor.css('cursor', 'wait');
            };
            var endWait = function() {
                editor.css('cursor', 'auto');
            };
            return {
                startWait: wait,
                endWait: endWait,
            };
        }(this);

        // state of editor component.
        var editorState = function(editor) {
            return {
                isReplicateAuto: false,
                buttonState: function() {
                    var disableButtons = {};
                    var updateDisableButtons = function(button, enable) {
                        if (enable) {
                            delete disableButtons[button];
                        } else {
                            disableButtons[button] = true;
                        }
                    };
                    var updateEntity = function() {
                        updateDisableButtons("entity", domSelector.span.getNumberOfSelected() > 0);
                    };
                    var updatePaste = function() {
                        updateDisableButtons("paste", clipBoard.length > 0 && domSelector.span.getNumberOfSelected() > 0);
                    };
                    var updateReplicate = function() {
                        updateDisableButtons("replicate", domSelector.span.getNumberOfSelected() == 1);
                    };
                    var updatePallet = function() {
                        updateDisableButtons("pallet", domSelector.entity.getNumberOfSelected() > 0);
                    };
                    var updateNewLabel = function() {
                        updateDisableButtons("newLabel", domSelector.entity.getNumberOfSelected() > 0);
                    };
                    var updateDelete = function() {
                        updateDisableButtons("delete", domSelector.hasSelecteds());
                    };
                    var updateCopy = function() {
                        updateDisableButtons("copy", domSelector.entity.hasSelecteds());
                    };
                    var updateBySpanAndEntityBoth = function() {
                        updateDelete();
                        updateCopy();
                    };
                    return {
                        pushed: function(button, push) {
                            editor.tool.pushReplicateAuto(push);
                        },
                        renderEnable: function() {
                            editor.tool.changeButtonState(disableButtons);
                        },
                        enabled: function(button, enable) {
                            updateDisableButtons(button, enable);
                            this.renderEnable();
                        },
                        updateBySpan: function() {
                            updateBySpanAndEntityBoth();

                            updateEntity();
                            updatePaste();
                            updateReplicate();

                            this.renderEnable();
                        },
                        updateByEntity: function() {
                            updateBySpanAndEntityBoth();

                            updatePallet();
                            updateNewLabel();

                            this.renderEnable();
                        },
                        updateAll: function() {
                            updateBySpanAndEntityBoth();

                            updateEntity();
                            updatePaste();
                            updateReplicate();
                            updatePallet();
                            updateNewLabel();

                            this.renderEnable();
                        },
                    };
                }(),
                toggleReplicateAuto: function() {
                    editorState.isReplicateAuto = !editorState.isReplicateAuto;
                    editorState.buttonState.pushed("replicate-auto", editorState.isReplicateAuto);
                },
            };
        }(this);

        // clipBoard has entity id only.
        var clipBoard = [];

        // parameters to render relations.
        var relationSettings = {
            // opacity of connectors
            connOpacity: 0.6,

            // curviness parameters
            xrate: 0.6,
            yrate: 0.05,

            // curviness offset
            c_offset: 20,
        };

        // spanConfig data
        var spanConfig = {
            delimiterCharacters: null,
            nonEdgeCharacters: null,
            defaults: {
                "delimiter characters": [
                    " ",
                    ".",
                    "!",
                    "?",
                    ",",
                    ":",
                    ";",
                    "-",
                    "/",
                    "&",
                    "(",
                    ")",
                    "{",
                    "}",
                    "[",
                    "]",
                    "+",
                    "*",
                    "\\",
                    "\"",
                    "'",
                    "\n",
                    "–"
                ],
                "non-edge characters": [
                    " ",
                    "\n"
                ]
            },
            set: function(config) {
                var settings = $.extend({}, this.defaults, config);

                if (settings['delimiter characters'] !== undefined) {
                    this.delimiterCharacters = settings['delimiter characters'];
                }

                if (settings['non-edge characters'] !== undefined) {
                    this.nonEdgeCharacters = settings['non-edge characters'];
                }
            },
            isNonEdgeCharacter: function(char) {
                return (this.nonEdgeCharacters.indexOf(char) >= 0);
            },
            isDelimiter: function(char) {
                return (this.delimiterCharacters.indexOf(char) >= 0);
            }
        };

        // model manages data objects.
        var model = function(editor) {
            return {
                sourceDoc: "",
                relationTypes: {},
                relationTypeDefault: "",
                annotationData: function() {
                    var sortedSpanIds = null;
                    var entitiesPerType;

                    var updateSpanTree = function() {
                        // sort the span IDs by the position
                        var sortedSpans = model.annotationData.getAllSpan().sort(function(a, b) {
                            return a.begin - b.begin || b.end - a.end;
                        });

                        //spanTree has parent-child structure.
                        var spanTree = [];
                        sortedSpans.forEach(function(span, index, array) {
                            $.extend(span, {
                                //reset children
                                children: [],
                                //order by position
                                left: index !== 0 ? array[index - 1] : null,
                                right: index !== array.length - 1 ? array[index + 1] : null,
                            });

                            //find parent of this span.
                            var prevOrderById = array[index - 1];
                            var lastPushedSpan = spanTree[spanTree.length - 1];
                            if (span.isChildOf(prevOrderById)) {
                                //last span order by id is parent.
                                //last span may be parent of current span because span id is sorted.
                                prevOrderById.children.push(span);
                                span.parent = prevOrderById;
                            } else if (prevOrderById && span.isChildOf(prevOrderById.parent)) {
                                //last span order by id is bigBrother.
                                //parent of last span may be parent of current span.
                                prevOrderById.parent.children.push(span);
                                span.parent = prevOrderById.parent;
                            } else　 if (span.isChildOf(lastPushedSpan)) {
                                //last pushed span is parent.
                                //this occur when prev node is also a child of last pushed span.
                                lastPushedSpan.children.push(span);
                                span.parent = lastPushedSpan;
                            } else {
                                //span has no parent.
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
                        model.annotationData.spanTree = spanTree;
                    };

                    var getMaxEntityId = function() {
                        var maxIdNum = 0;
                        var entityIds = Object.keys(model.annotationData.entities)
                            .filter(function(eid) {
                                return eid[0] === "E";
                            })
                            .map(function(eid) {
                                return eid.slice(1);
                            });
                        entityIds.sort(function(a, b) {
                            //reverse by number
                            return b - a;
                        });

                        return parseInt(entityIds[0]) || 0;
                    };

                    var innerAddSpan = function(span) {
                        var additionalPropertiesForSpan = {
                            //type is one per one span.
                            types: {},
                            isChildOf: function(maybeParent) {
                                return maybeParent && maybeParent.begin <= span.begin && span.end <= maybeParent.end;
                            },
                            //for debug. print myself only.
                            toStringOnlyThis: function() {
                                return "span " + this.begin + ":" + this.end + ":" + model.sourceDoc.substring(this.begin, this.end);
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
                            //a big brother is brother node on a structure at rendered.
                            //thre is no big brother if the span is first in a paragrpah.
                            //Warning: parent is set at updateSpanTree, is not exists now.
                            getBigBrother: function() {
                                var index;
                                if (this.parent) {
                                    index = this.parent.children.indexOf(this);
                                    return index === 0 ? null : this.parent.children[index - 1];
                                } else {
                                    index = model.annotationData.spanTree.indexOf(this);
                                    return index === 0 || model.annotationData.spanTree[index - 1].paragraph !== this.paragraph ? null : model.annotationData.spanTree[index - 1];
                                }
                            },
                            //get online for update is not grantieed.
                            getTypes: function() {
                                return $.map(this.types, function(value, key) {
                                    return {
                                        id: key,
                                        name: value,
                                        entities: entitiesPerType[key],
                                    };
                                });
                            }
                        };

                        //get the paragraph that span is belong to.
                        var findParagraph = function(self) {
                            var match = model.annotationData.paragraphsArray.filter(function(p) {
                                return self.begin >= p.begin && self.end <= p.end;
                            });
                            return match.length > 0 ? match[0] : null;
                        };

                        var spanId = idFactory.makeSpanId(span.begin, span.end);

                        //add a span unless exists, because an annotations.json is defiend by entities so spans are added many times. 
                        if (!model.annotationData.spans[spanId]) {
                            //a span is exteded nondestructively to render.
                            model.annotationData.spans[spanId] = $.extend({
                                    id: spanId,
                                    paragraph: findParagraph(span),
                                },
                                span,
                                additionalPropertiesForSpan);
                        }
                    };

                    return {
                        spans: null,
                        entities: null,
                        relations: null,
                        reset: function() {
                            model.annotationData.spans = {};
                            model.annotationData.entities = {};
                            model.annotationData.relations = {};
                        },
                        //expected span is like { "begin": 19, "end": 49 }
                        addSpan: function(span) {
                            innerAddSpan(span);
                            updateSpanTree();
                        },
                        removeSpan: function(spanId) {
                            delete model.annotationData.spans[spanId];
                            updateSpanTree();
                        },
                        getSpan: function(spanId) {
                            return model.annotationData.spans[spanId];
                        },
                        getRangeOfSpan: function(firstId, secondId) {
                            var firstIndex = sortedSpanIds.indexOf(firstId);
                            var secondIndex = sortedSpanIds.indexOf(secondId);

                            //switch if seconfIndex before firstIndex
                            if (secondIndex < firstIndex) {
                                var tmpIndex = firstIndex;
                                firstIndex = secondIndex;
                                secondIndex = tmpIndex;
                            }

                            return sortedSpanIds.slice(firstIndex, secondIndex + 1);
                        },
                        getAllSpan: function() {
                            return $.map(model.annotationData.spans, function(span) {
                                return span;
                            });
                        },
                        //expected entiy like {id: "E21", span: "editor2__S50_54", type: "Protein"}.
                        addEntity: function(entity) {
                            //expect the span is alredy exists
                            var addEntityToSpan = function(entity) {
                                var addEntityToType = function(typeId, entityId) {
                                    if (entitiesPerType[typeId]) {
                                        entitiesPerType[typeId].push(entityId);
                                    } else {
                                        entitiesPerType[typeId] = [entityId];
                                    }
                                };

                                var typeId = idFactory.makeTypeId(entity.span, entity.type);
                                //span must have types as object.
                                model.annotationData.spans[entity.span].types[typeId] = entity.type;
                                addEntityToType(typeId, entity.id);
                            };

                            model.annotationData.entities[entity.id] = entity;
                            addEntityToSpan(entity);
                        },
                        removeEnitity: function(entityId) {
                            var removeEntityFromSpan = function(spanId, type, entityId) {
                                'use strict';
                                var typeId = idFactory.makeTypeId(spanId, type);

                                //remove entity
                                var arr = entitiesPerType[typeId];
                                arr.splice(arr.indexOf(entityId), 1);

                                //remove type
                                if (entitiesPerType[typeId].length === 0) {
                                    delete entitiesPerType[typeId];
                                    delete model.annotationData.spans[spanId].types[typeId];
                                }
                            };

                            var endity = model.annotationData.entities[entityId];
                            removeEntityFromSpan(endity.span, endity.type, entityId);
                            delete model.annotationData.entities[entityId];
                            return endity;
                        },
                        parseParagraphs: function(sourceDoc) {
                            var paragraphsArray = [];
                            var textLengthBeforeThisParagraph = 0;
                            sourceDoc.split("\n").forEach(function(p, index, array) {
                                paragraphsArray.push({
                                    id: idFactory.makeParagraphId(index),
                                    begin: textLengthBeforeThisParagraph,
                                    end: textLengthBeforeThisParagraph + p.length,
                                });

                                textLengthBeforeThisParagraph += p.length + 1;
                            });
                            model.annotationData.paragraphsArray = paragraphsArray;
                        },
                        //expected denotations Array of object like { "id": "T1", "span": { "begin": 19, "end": 49 }, "obj": "Cell" }.
                        parseDenotations: function(denotations) {
                            if (denotations) {
                                entitiesPerType = {};

                                denotations.forEach(function(entity) {
                                    innerAddSpan(entity.span);
                                    model.annotationData.addEntity({
                                        id: entity.id,
                                        span: idFactory.makeSpanId(entity.span.begin, entity.span.end),
                                        type: entity.obj,
                                    });
                                });

                                updateSpanTree();
                            }
                        },
                        parseRelations: function(relations) {
                            if (relations) {
                                relations.forEach(function(r) {
                                    model.annotationData.relations[r.id] = r;
                                });
                            }
                        },
                        getRelationIds: function() {
                            return Object.keys(model.annotationData.relations);
                        },
                        getNewEntityId: function() {
                            return "E" + (getMaxEntityId() + 1);
                        },
                        toJason: function() {
                            var denotations = [];
                            for (var e in model.annotationData.entities) {
                                var span = {
                                    'begin': model.annotationData.spans[model.annotationData.entities[e].span].begin,
                                    'end': model.annotationData.spans[model.annotationData.entities[e].span].end
                                };
                                denotations.push({
                                    'id': e,
                                    'span': span,
                                    'obj': model.annotationData.entities[e].type
                                });
                            }

                            return JSON.stringify({
                                "text": model.sourceDoc,
                                "denotations": denotations
                            });
                        }
                    };
                }(),
                entityTypes: function() {
                    var types = {},
                        defaultType = "",
                        getColor = function() {
                            return this.color ? this.color : "#77DDDD";
                        };

                    return {
                        setDefaultType: function(nameOfEntityType) {
                            defaultType = nameOfEntityType;
                        },
                        getDefaultType: function() {
                            return defaultType || model.entityTypes.getSortedNames()[0];
                        },
                        getType: function(nameOfEntityType) {
                            types[nameOfEntityType] = types[nameOfEntityType] || {
                                getColor: getColor
                            };
                            return types[nameOfEntityType];
                        },
                        set: function(newEntityTypes) {
                            // expected newEntityTypes is an array of object. example of object is {"name": "Regulation","color": "#FFFF66","default": true}.
                            types = {};
                            defaultType = "";
                            if (newEntityTypes !== undefined) {
                                newEntityTypes.forEach(function(newEntity) {
                                    newEntity.getColor = getColor;
                                    types[newEntity.name] = newEntity;
                                    if (newEntity["default"] === true) {
                                        defaultType = newEntity.name;
                                    }
                                });
                            }
                        },
                        //save number of type, to sort by numer when show entity pallet.
                        incrementNumberOfTypes: function(nameOfEntityType) {
                            //access by square brancket, because nameOfEntityType is user input value, maybe 'null', '-', and other invalid indentifier name.
                            var type = model.entityTypes.getType(nameOfEntityType);
                            type.count = (type.count || 0) + 1;
                        },
                        getSortedNames: function() {
                            //sort by number of types
                            var typeNames = Object.keys(types);
                            typeNames.sort(function(a, b) {
                                return types[b].count - types[a].count;
                            });
                            return typeNames;
                        }
                    };
                }(),
                connectorTypes: {},
                getSpanReplications: function(span) {
                    // check the bondaries: used after replication
                    var isOutsideDelimiter = function(document, startPos, endPos) {
                        var precedingChar = document.charAt(startPos - 1);
                        var followingChar = document.charAt(endPos);

                        if (!spanConfig.isDelimiter(precedingChar) || !spanConfig.isDelimiter(followingChar)) {
                            return true;
                        } else {
                            return false;
                        }
                    };

                    // search same strings
                    // both ends should be delimiter characters
                    var findSameString = function(startPos, endPos) {
                        var oentity = model.sourceDoc.substring(startPos, endPos);
                        var strLen = endPos - startPos;

                        var ary = [];
                        var from = 0;
                        while (true) {
                            var sameStrPos = model.sourceDoc.indexOf(oentity, from);
                            if (sameStrPos == -1) break;

                            if (!isOutsideDelimiter(model.sourceDoc, sameStrPos, sameStrPos + strLen)) {
                                var obj = {};
                                obj.begin = sameStrPos;
                                obj.end = sameStrPos + strLen;

                                var isExist = false;
                                for (var sid in model.annotationData.spans) {
                                    if (model.annotationData.spans[sid].begin == obj.begin && model.annotationData.spans[sid].end == obj.end && model.annotationData.spans[sid].category == obj.category) {
                                        isExist = true;
                                        break;
                                    }
                                }

                                if (!isExist && startPos != sameStrPos) {
                                    ary.push(obj);
                                }
                            }
                            from = sameStrPos + 1;
                        }
                        return ary;
                    };

                    var startPos = span.begin;
                    var endPos = span.end;

                    var cspans = findSameString(startPos, endPos); // candidate model.annotationData.spans

                    var nspans = []; // new model.annotationData.spans
                    for (var i = 0; i < cspans.length; i++) {
                        cspan = cspans[i];

                        // check boundary crossing
                        var crossing_p = false;
                        for (var sid in model.annotationData.spans) {
                            if (
                                (cspan.begin > model.annotationData.spans[sid].begin && cspan.begin < model.annotationData.spans[sid].end && cspan.end > model.annotationData.spans[sid].end) ||
                                (cspan.begin < model.annotationData.spans[sid].begin && cspan.end > model.annotationData.spans[sid].begin && cspan.end < model.annotationData.spans[sid].end)
                            ) {
                                crossing_p = true;
                                break;
                            }
                        }

                        if (!crossing_p) {
                            nspans.push(cspan);
                        }
                    }
                },
            };
        }(this);

        var connectors;

        // index
        var relationsPerEntity;

        // constant values
        var CONSTS = {
            BLOCK_THRESHOLD: 100,
            TYPE_MARGIN_TOP: 18,
            TYPE_MARGIN_BOTTOM: 2,
            PALLET_HEIGHT_MAX: 100
        };

        // will be API of texteaEditor
        var startEdit = function startEdit() {
            var setTypeConfig = function(config) {
                model.entityTypes.set(config['entity types']);

                model.relationTypes = {};
                model.relationTypeDefault = null;
                if (config['relation types'] !== undefined) {
                    var relation_types = config['relation types'];
                    for (var i in relation_types) {
                        model.relationTypes[relation_types[i].name] = relation_types[i];
                        if (relation_types[i]["default"] === true) {
                            model.relationTypeDefault = relation_types[i].name;
                        }
                    }
                    if (!model.relationTypeDefault) {
                        model.relationTypeDefault = relation_types[0].name;
                    }
                }

                model.connectorTypes = {};

                if (config.css !== undefined) {
                    $('#css_area').html('<link rel="stylesheet" href="' + config.css + '"/>');
                }
            };

            var initState = function() {
                command.history.init(command.historyChanged);
                editorState.buttonState.updateAll();
            };

            renderer.init();
            controller.init();
            initState();

            // read default spanConfig
            spanConfig.set();

            var params = {
                debug: this.attr("debug"),
                config: this.attr("config"),
                target: this.attr("annotations")
            };

            if (params.config && params.config !== "") {
                // load sync, because load annotation after load config. 
                var data = textAeUtil.ajaxAccessor.getSync(params.config);
                if (data !== null) {
                    spanConfig.set(data);
                    setTypeConfig(data);
                } else {
                    alert('could not read the span configuration from the location you specified.');
                }
            }

            if (params.target && params.target !== "") {
                dataAccessObject.getAnnotationFromServer(params.target);
            }
        }.bind(this);

        var command = {
            // histories of edit to undo and redo.
            history: function() {
                var lastSaveIndex = -1,
                    lastEditIndex = -1,
                    history = [],
                    onChangeFunc,
                    trigger = function() {
                        if (onChangeFunc) {
                            onChangeFunc();
                        }
                    };

                return {
                    init: function(onChange) {
                        lastSaveIndex = -1;
                        lastEditIndex = -1;
                        history = [];

                        if (onChange !== undefined) {
                            onChangeFunc = onChange.bind(this);
                        }
                        trigger();
                    },
                    push: function(commands) {
                        history.push(commands);
                        lastEditIndex++;
                        trigger();
                    },
                    next: function() {
                        lastEditIndex++;
                        trigger();
                        return history[lastEditIndex];
                    },
                    prev: function() {
                        var lastEdit = history[lastEditIndex];
                        lastEditIndex--;
                        trigger();
                        return lastEdit;
                    },
                    saved: function() {
                        lastSaveIndex = lastEditIndex;
                        trigger();
                    },
                    hasAnythingToUndo: function() {
                        return lastEditIndex > -1;
                    },
                    hasAnythingToRedo: function() {
                        return lastEditIndex < history.length - 1;
                    },
                    hasAnythingToSave: function() {
                        return lastEditIndex != lastSaveIndex;
                    }
                };
            }(),
            //action when command.history is changed.
            historyChanged: function() {
                var leaveMessage = function() {
                    return "There is a change that has not been saved. If you leave now, you will lose it.";
                };

                //change button state
                editorState.buttonState.enabled("write", this.hasAnythingToSave());
                editorState.buttonState.enabled("undo", this.hasAnythingToUndo());
                editorState.buttonState.enabled("redo", this.hasAnythingToRedo());

                //change leaveMessage show
                if (this.hasAnythingToSave()) {
                    $(window).off('beforeunload', leaveMessage).on('beforeunload', leaveMessage);
                } else {
                    $(window).off('beforeunload', leaveMessage);
                }
            },
            //context may be 'undo' or 'redo'.
            execute: function(commands, context) {
                if (commands && commands.length > 0) {
                    commands = command.util.uniq(commands);

                    switch (context) {
                        case 'undo':
                        case 'redo':
                            domSelector.unselect();
                            renderer.relations.clearRelationSelection();
                            break;
                        default:
                    }
                    var tid, arr;

                    for (var i in commands) {
                        var edit = commands[i];
                        switch (edit.action) {
                            // span operations
                            case 'new_span':
                                try {
                                    // model
                                    model.annotationData.addSpan({
                                        begin: edit.begin,
                                        end: edit.end
                                    });

                                    // rendering
                                    renderer.renderSpan(edit.id);

                                    // select
                                    domSelector.span.select(edit.id);
                                } catch (e) {
                                    // rollback model data unless dom create.
                                    model.annotationData.removeSpan(edit.id);
                                    throw e;
                                }

                                break;
                            case 'remove_span':
                                //save span potision for undo
                                var span = model.annotationData.getSpan(edit.id);
                                edit.begin = span.begin;
                                edit.end = span.end;
                                //model
                                model.annotationData.removeSpan(edit.id);
                                //rendering
                                renderer.destroySpan(edit.id);
                                renderer.renderGrid(edit.id);
                                break;

                                // entity operations
                            case 'new_denotation':
                                // model
                                var newEntity = {
                                    id: edit.id || model.annotationData.getNewEntityId(),
                                    span: edit.span,
                                    type: edit.type
                                };
                                model.annotationData.addEntity(newEntity);

                                // rendering
                                renderer.renderGrid(newEntity.span);
                                renderer.renderEntity(newEntity);
                                // select
                                domSelector.entity.select(edit.id);
                                break;
                            case 'remove_denotation':
                                //model
                                var deleteEntity = model.annotationData.removeEnitity(edit.id);

                                //rendering
                                renderer.renderEntity(deleteEntity);
                                renderer.renderGrid(deleteEntity.span);
                                break;
                            case 'change_entity_type':
                                //model
                                var changedEntity = model.annotationData.removeEnitity(edit.id);
                                changedEntity.type = edit.new_type;
                                model.annotationData.addEntity(changedEntity);
                                //rendering
                                renderer.renderEntity(changedEntity);
                                renderer.renderGrid(changedEntity.span);
                                break;

                                // relation operations
                            case 'new_relation':
                                // model
                                model.annotationData.relations[edit.id] = {
                                    id: edit.id,
                                    subj: edit.subj,
                                    obj: edit.obj,
                                    pred: edit.pred
                                };
                                if (relationsPerEntity[edit.subj]) {
                                    if (relationsPerEntity[edit.subj].indexOf(edit.id) < 0) relationsPerEntity[edit.subj].push(edit.id);
                                } else relationsPerEntity[edit.subj] = [edit.id];

                                if (relationsPerEntity[edit.obj]) {
                                    if (relationsPerEntity[edit.obj].indexOf(edit.id) < 0) relationsPerEntity[edit.obj].push(edit.id);
                                } else relationsPerEntity[edit.obj] = [edit.id];
                                // rendering
                                connectors[edit.id] = renderer.relations.renderRelation(edit.id);
                                // selection
                                renderer.relations.selectRelation(edit.id);
                                break;
                            case 'remove_relation':
                                // model
                                delete model.annotationData.relations[edit.id];
                                arr = relationsPerEntity[edit.subj];
                                arr.splice(arr.indexOf(edit.id), 1);
                                if (arr.length === 0) {
                                    delete relationsPerEntity[edit.subj];
                                }
                                arr = relationsPerEntity[edit.obj];
                                arr.splice(arr.indexOf(edit.id), 1);
                                if (arr.length === 0) {
                                    delete relationsPerEntity[edit.obj];
                                }
                                // rendering
                                renderer.relations.destroyRelation(edit.id);
                                break;
                            case 'change_relation_pred':
                                // model
                                model.annotationData.relations[edit.id].pred = edit.new_pred;
                                // rendering
                                connectors[edit.id].setPaintStyle(model.connectorTypes[edit.new_pred + "_selected"].paintStyle);
                                connectors[edit.id].setHoverPaintStyle(model.connectorTypes[edit.new_pred + "_selected"].hoverPaintStyle);
                                connectors[edit.id].setLabel('[' + edit.id + '] ' + edit.new_pred);
                                // selection
                                renderer.relations.selectRelation(edit.id);
                                break;
                            default:
                                // do nothing
                        }
                    }

                    // update rendering
                    presentationLogic.redraw();

                    switch (context) {
                        case 'undo':
                        case 'redo':
                            break;
                        default:
                            command.history.push(commands);
                            editorState.buttonState.updateAll();
                    }
                }
            },
            create: {
                replicateSpanCommands: function(span) {
                    var nspans = model.getSpanReplications(span);

                    var commands = [];
                    for (var j = 0; j < nspans.length; j++) {
                        var nspan = nspans[j];
                        var id = idFactory.makeSpanId(nspan.begin, nspan.end);
                        commands.push({
                            action: "new_span",
                            id: id,
                            begin: nspan.begin,
                            end: nspan.end
                        });
                    }

                    return commands;
                },
                removeSpanCommand: function(spanId) {
                    return {
                        action: 'remove_span',
                        id: spanId,
                    };
                },
                removeEntityCommand: function(entityId) {
                    //span and type are neccesary to undo.
                    var entity = model.annotationData.entities[entityId];
                    return {
                        action: 'remove_denotation',
                        id: entityId,
                        span: entity.span,
                        type: entity.type,
                    };
                },
                removeRelationCommand: function(relationId) {
                    return {
                        action: 'remove_relation',
                        id: relationId,
                        subj: model.annotationData.relations[relationId].subj,
                        obj: model.annotationData.relations[relationId].obj,
                        pred: model.annotationData.relations[relationId].pred
                    };
                },
            },
            util: {
                uniq: function(commands) {
                    var hash = {}, hashKey, result = [];

                    commands.forEach(function(command) {
                        hash[command.id] = command;
                    });

                    for (hashKey in hash) {
                        result.push(hash[hashKey]);
                    }
                    return result;
                },
            },
        };

        var idFactory = function(editor) {
            return {
                // paragraph id
                makeParagraphId: function(index) {
                    return editor.editorId + '__P' + index;
                },
                // span id
                makeSpanId: function(begin, end) {
                    return editor.editorId + '__S' + begin + '_' + end;
                },
                // type id
                makeTypeId: function(sid, type) {
                    return sid + '-' + type;
                },
                makeEntityDomId: function(entityId) {
                    return editor.editorId + '__E' + entityId;
                }
            };
        }(this);

        // render view.
        var renderer = function(editor) {

            var relationColor = function(type) {
                if (model.relationTypes && model.relationTypes[type] && model.relationTypes[type].color) return model.relationTypes[type].color;
                return "#555555";
            };

            // conversion from HEX to RGBA color
            var colorTrans = function(color, opacity) {
                var c = color.slice(1);
                var r = c.substr(0, 2);
                var g = c.substr(2, 2);
                var b = c.substr(4, 2);
                r = parseInt(r, 16);
                g = parseInt(g, 16);
                b = parseInt(b, 16);

                return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
            };

            return {
                init: function() {
                    var getArea = function($parent, className) {
                        var $area = editor.find('.' + className);
                        if ($area.length === 0) {
                            $area = $('<div>').addClass(className);
                            $parent.append($area);
                        }
                        return $area;
                    };

                    var initJsPlumb = function() {
                        renderer.jsPlumb = jsPlumb.getInstance({
                            ConnectionsDetachable: false,
                            Endpoint: ["Dot", {
                                radius: 1
                            }]
                        });
                        renderer.jsPlumb.setRenderMode(renderer.jsPlumb.SVG);
                        renderer.jsPlumb.Defaults.Container = editor.getAnnotationArea();
                    };

                    //make view
                    editor.body = getArea(editor, "textae-editor__body");

                    //set method to get Area
                    $.extend(editor, {
                        getSourceDocArea: function() {
                            return getArea(editor.body, "textae-editor__body__text-box");
                        },
                        getAnnotationArea: function() {
                            return getArea(editor.body, 'textae-editor__body__annotation_box');
                        }
                    });

                    initJsPlumb();
                },

                renderAnnotation: function() {
                    var setBodyOffset = function() {
                        //set body offset top half of line space between line of text-box.
                        var $area = editor.getSourceDocArea();
                        $area.html(model.sourceDoc);
                        var lines = $area.get(0).getClientRects();
                        var lineSpace = lines[1].top - lines[0].bottom;
                        editor.find(".textae-editor__body").css("paddingTop", lineSpace / 2);
                        $area.empty();
                    };

                    //souce document has multi paragraphs that are splited by '\n'.
                    var getTaggedSourceDoc = function() {
                        //set sroucedoc tagged <p> per line.
                        return model.sourceDoc.split("\n").map(function(par) {
                            return '<p class="textae-editor__body__text-box__paragraph">' + par + '</p>';
                        }).join("\n");
                    };

                    //paragraphs is Object that has position of charactor at start and end of the statement in each paragraph.
                    var makeParagraphs = function() {
                        var paragraphs = {};

                        //enchant id to paragraph element and chache it.
                        editor.getSourceDocArea().find('p').each(function(index, element) {
                            var $element = $(element);
                            var paragraph = $.extend(model.annotationData.paragraphsArray[index], {
                                element: $element,
                            });
                            $element.attr('id', paragraph.id);

                            paragraphs[paragraph.id] = paragraph;
                        });

                        return paragraphs;
                    };

                    var renderAllSpan = function() {
                        model.annotationData.spanTree.forEach(function(span) {
                            renderer.renderSpan(span.id);
                        });
                    };

                    var setConnectorTypes = function() {
                        for (var name in model.relationTypes) {
                            var c = relationColor(name);
                            var rgba0 = colorTrans(c, relationSettings.connOpacity);
                            var rgba1 = colorTrans(c, 1);

                            model.connectorTypes[name] = {
                                paintStyle: {
                                    strokeStyle: rgba0,
                                    lineWidth: 1
                                },
                                hoverPaintStyle: {
                                    strokeStyle: rgba1,
                                    lineWidth: 3
                                }
                            };
                            model.connectorTypes[name + '_selected'] = {
                                paintStyle: {
                                    strokeStyle: rgba1,
                                    lineWidth: 3
                                },
                                hoverPaintStyle: {
                                    strokeStyle: rgba1,
                                    lineWidth: 3
                                }
                            };
                        }
                    };

                    //render an source document
                    setBodyOffset();
                    editor.getSourceDocArea().html(getTaggedSourceDoc());
                    renderer.paragraphs = makeParagraphs();

                    //render annotations
                    editor.getAnnotationArea().empty();
                    renderer.renderSize.mesure();
                    renderer.positions.reset();
                    renderAllSpan();

                    //render relations
                    setConnectorTypes();
                    renderer.relations.renderRelations();
                },
                //size of class rendered really
                renderSize: {
                    gridWidthGap: 0,
                    typeHeight: 0,
                    entityWidth: 0,
                    mesure: function() {
                        var div = '<div id="temp_grid" class="textae-editor__grid" style="width:10px; height:auto"></div>';
                        editor.getAnnotationArea().append(div);

                        div = '<div id="temp_type" class="textae-editor__type" title="[Temp] Temp" >T0</div>';
                        $('#temp_grid').append(div);

                        div = '<div id="temp_entity_pane" class="textae-editor__entity_pane"><div id="temp_entity" class="textae-editor__entity"></div></div>';
                        $('#temp_type').append(div);

                        renderer.renderSize.gridWidthGap = $('#temp_grid').outerWidth() - 10;
                        renderer.renderSize.typeHeight = $('#temp_type').outerHeight();
                        renderer.renderSize.entityWidth = $('#temp_entity').outerWidth();
                        $('#temp_grid').remove();
                    }
                },
                renderSpan: function(spanId) {
                    //render single span
                    var renderSingleSpan = function(currentSpan) {
                        // create potision to a new span add 
                        var createRange = function(textNode, textNodeStartPosition) {
                            var startPos = currentSpan.begin - textNodeStartPosition;
                            var endPos = currentSpan.end - textNodeStartPosition;
                            if (startPos < 0 || textNode.length < endPos) {
                                throw new Error("oh my god! I cannot render this span. " + currentSpan.toStringOnlyThis() + ", textNode " + textNode.textContent);
                            }

                            var range = document.createRange();
                            range.setStart(textNode, startPos);
                            range.setEnd(textNode, endPos);
                            return range;
                        };

                        // get Range to that new span tag insert.
                        // this function works well when no child span is rendered. 
                        var getRangeToInsertSpanTag = function(spanId) {
                            var createRangeForFirstSpanInParagraph = function(currentSpan) {
                                var paragraph = renderer.paragraphs[currentSpan.paragraph.id];
                                textNodeInParagraph = paragraph.element.contents().filter(function() {
                                    return this.nodeType === 3; //TEXT_NODE
                                }).get(0);
                                return createRange(textNodeInParagraph, paragraph.begin);
                            };

                            //the parent of the bigBrother is same withc currentSpan, whitc is a span or the root of spanTree. 
                            var bigBrother = currentSpan.getBigBrother();
                            if (bigBrother) {
                                //the target text arrounded by currentSpan is in a textNode after the bigBrother if bigBrother exists.
                                return createRange(document.getElementById(bigBrother.id).nextSibling, bigBrother.end);
                            } else {
                                //the target text arrounded by currentSpan is the first child of parent unless bigBrother exists.
                                if (currentSpan.parent) {
                                    //parent is span
                                    var textNodeInPrevSpan = $("#" + currentSpan.parent.id).contents().filter(function() {
                                        return this.nodeType === 3;
                                    }).get(0);
                                    return createRange(textNodeInPrevSpan, currentSpan.parent.begin);
                                } else {
                                    //parent is paragraph
                                    return createRangeForFirstSpanInParagraph(currentSpan);
                                }
                            }
                        };

                        var element = document.createElement('span');
                        element.setAttribute('id', currentSpan.id);
                        element.setAttribute('title', currentSpan.id);
                        element.setAttribute('class', 'textae-editor__span');
                        getRangeToInsertSpanTag(currentSpan.id).surroundContents(element);
                    };

                    //destoroy DOM elements of descendant spans.
                    var destroySpanRecurcive = function(span) {
                        span.children.forEach(function(span) {
                            destroySpanRecurcive(span);
                        });
                        renderer.destroySpan(span.id);
                    };

                    //render entity of span
                    var renderEntitiesOfSpan = function(span) {
                        var typeArray = span.getTypes();
                        // render grid unless span has entities.
                        if (typeArray) {
                            //render a gird.
                            renderer.renderGrid(span.id);

                            //render entities.
                            typeArray.forEach(function(type) {
                                type.entities.forEach(function(entityId) {
                                    renderer.renderEntity(model.annotationData.entities[entityId]);
                                });
                            });
                        }
                    };

                    //rerender children to add new span over exists spans.
                    var currentSpan = model.annotationData.spans[spanId];

                    //destroy rendered children.
                    currentSpan.children.filter(function(childSpan) {
                        return document.getElementById(childSpan.id) !== null;
                    }).forEach(function(childSpan) {
                        destroySpanRecurcive(childSpan);
                    });

                    renderSingleSpan(currentSpan);
                    renderer.positions.indexPositionSpan(currentSpan.id);
                    renderEntitiesOfSpan(currentSpan);

                    //render unredered children.
                    currentSpan.children.filter(function(childSpan) {
                        return document.getElementById(childSpan.id) === null;
                    }).forEach(function(childSpan) {
                        renderer.renderSpan(childSpan.id);
                    });
                },
                destroySpan: function(spanId) {
                    var spanElement = document.getElementById(spanId);
                    var parent = spanElement.parentNode;
                    while (spanElement.firstChild) {
                        parent.insertBefore(spanElement.firstChild, spanElement);
                    }
                    parent.removeChild(spanElement);
                    parent.normalize();
                },
                //a circle on Type
                renderEntity: function(entity) {
                    var doesModelHasEntity = function(entity) {
                        return model.annotationData.entities[entity.id];
                    };

                    var entityElement = {
                        show: function(entity) {
                            var getColor = function(type) {
                                return model.entityTypes.getType(type).getColor();
                            };

                            var createEntityElement = function(entity) {
                                var color = getColor(entity.type);

                                return $('<div>')
                                    .attr('id', idFactory.makeEntityDomId(entity.id))
                                    .attr('title', entity.id)
                                    .attr('type', String(entity.type)) //if null replace to 'null'
                                .addClass('textae-editor__entity')
                                    .css({
                                        'border-color': color
                                    });
                            };

                            //render type unless exists.
                            var getTypeElement = function(spanId, type) {
                                //type has entity_pane has entities and label.
                                var createType = function(type, typeId) {
                                    //entityPane has entities
                                    var $entityPane = $('<div>')
                                        .attr('id', 'P-' + typeId)
                                        .addClass('textae-editor__entity_pane');

                                    //label over span
                                    var $typeLabel = $('<div>')
                                        .addClass('textae-editor__type_label')
                                        .text(type)
                                        .css({
                                            'background-color': getColor(type),
                                        });

                                    return $('<div>')
                                        .attr('id', typeId)
                                        .addClass('textae-editor__type')
                                        .css({
                                            'padding-top': CONSTS.TYPE_MARGIN_TOP,
                                            'margin-bottom': CONSTS.TYPE_MARGIN_BOTTOM
                                        })
                                        .append($typeLabel)
                                        .append($entityPane); //set pane after label because pane is over label.
                                };

                                var typeId = idFactory.makeTypeId(spanId, type);

                                var $type = $('#' + typeId);
                                if ($type.length === 0) {
                                    $type = createType(type, typeId);
                                    $('#G' + spanId).append($type);
                                }

                                return $type;
                            };

                            //create entity element unless exists
                            var $entity = domSelector.entity.get(entity.id);
                            if (domSelector.entity.get(entity.id).length === 0) {
                                $entity = createEntityElement(entity);

                                //append to the type
                                getTypeElement(entity.span, entity.type)
                                    .find(".textae-editor__entity_pane")
                                    .append($entity);

                                renderer.positions.indexPositionEntity(entity.id);
                            } else {
                                //change type of exists entity.

                                //remove old
                                entityElement.hide(entity);

                                //show new
                                entityElement.show(entity);
                            }
                        },
                        hide: function(entity) {
                            var isTypeNotExists = function(typeName) {
                                return model.annotationData.spans[entity.span].getTypes().filter(function(type) {
                                    return type.name == typeName;
                                }).length === 0;
                            };

                            //an entity may have new type when changing type of the entity.
                            //DOM has old type.
                            var typeOnDom = domSelector.entity.get(entity.id).remove().attr('type');

                            //delete type if no entity.
                            if (isTypeNotExists(typeOnDom)) {
                                $('#' + idFactory.makeTypeId(entity.span, typeOnDom)).remove();
                            }
                        },
                    };

                    //show entity when model has that entity.
                    if (doesModelHasEntity(entity)) {
                        entityElement.show(entity);
                    } else {
                        entityElement.hide(entity);
                    }
                },
                renderGrid: function(spanId) {
                    var doesSpanHasType = function(spanId) {
                        return model.annotationData.spans[spanId] && model.annotationData.spans[spanId].getTypes().length > 0;
                    };

                    var gridElement = {
                        show: function(gridId) {
                            var createDiv = function(id) {
                                return $("<div>")
                                    .attr("id", id)
                                    .addClass('textae-editor__grid');
                            };

                            var getGrid = function(gridId) {
                                $grid = $('#' + gridId);
                                if ($grid.length === 0) {
                                    $grid = createDiv(gridId);

                                    //append to the annotation area.
                                    editor.getAnnotationArea().append($grid);
                                }
                                return $grid;
                            };

                            var setPosition = function($grid, gridPosition) {
                                $grid.css({
                                    'position': 'absolute',
                                    'top': gridPosition.top,
                                    'left': gridPosition.left,
                                    'width': gridPosition.width,
                                    'height': gridPosition.height
                                });
                            };

                            var $grid = getGrid(gridId);
                            var gridPosition = renderer.positions.getGridPosition(spanId);
                            setPosition($grid, gridPosition);

                            // for functions 'indexPositionEntity', to calculate position of entity.
                            renderer.positions.grid[gridId] = gridPosition;
                        },
                        hide: function(gridId) {
                            $grid = $('#' + gridId);
                            $grid.remove();
                            delete renderer.positions.grid[gridId];
                        }
                    };

                    //show grid when the span has types.
                    var gridId = 'G' + spanId;
                    if (doesSpanHasType(spanId)) {
                        gridElement.show(gridId);
                    } else {
                        gridElement.hide(gridId);
                    }
                },
                positions: {
                    reset: function() {
                        this.span = {}; //stick grid on span
                        this.grid = {}; //stick entity on grid
                        this.entity = {}; //adjust relation curviness on entity 
                    },
                    indexPositionSpan: function(spanId) {
                        var $span = $('#' + spanId);

                        if ($span.length === 0) {
                            throw new Error("span is not renderd : " + spanId);
                        }

                        renderer.positions.span[spanId] = {
                            top: $span.get(0).offsetTop,
                            left: $span.get(0).offsetLeft,
                            width: $span.outerWidth(),
                            height: $span.outerHeight(),
                            center: $span.get(0).offsetLeft + $span.outerWidth() / 2,
                        };
                    },
                    indexPositionEntity: function(entityId) {
                        var spanId = model.annotationData.entities[entityId].span;

                        var $entity = domSelector.entity.get(entityId);
                        if ($entity.length === 0) {
                            throw new Error("entity is not rendered : " + entityId);
                        }

                        //use to calculate relation curvines.
                        var gridPosition = renderer.positions.getGridPosition(spanId);
                        renderer.positions.entity[entityId] = {
                            top: gridPosition.top + $entity.get(0).offsetTop,
                            left: gridPosition.left + $entity.get(0).offsetLeft,
                            width: $entity.outerWidth(),
                            height: $entity.outerHeight(),
                            center: gridPosition.left + $entity.get(0).offsetLeft + $entity.outerWidth() / 2,
                        };
                    },
                    //height of $grid is adapt number of types on the span.
                    getGridPosition: function(spanId) {
                        var gridHeight = model.annotationData.spans[spanId].getTypes().length * (renderer.renderSize.typeHeight + CONSTS.TYPE_MARGIN_BOTTOM);
                        return {
                            offset: CONSTS.TYPE_MARGIN_BOTTOM,
                            top: renderer.positions.span[spanId].top - CONSTS.TYPE_MARGIN_BOTTOM - gridHeight,
                            left: renderer.positions.span[spanId].left,
                            width: renderer.positions.span[spanId].width - renderer.renderSize.gridWidthGap,
                            height: gridHeight,
                        };
                    },

                },
                relations: function() {
                    var determineCurviness = function(sourceId, targetId) {
                        var sourceX = renderer.positions.entity[sourceId].center;
                        var targetX = renderer.positions.entity[targetId].center;

                        var sourceY = renderer.positions.entity[sourceId].top;
                        var targetY = renderer.positions.entity[targetId].top;

                        var xdiff = Math.abs(sourceX - targetX);
                        var ydiff = Math.abs(sourceY - targetY);
                        var curviness = xdiff * relationSettings.xrate + ydiff * relationSettings.yrate + relationSettings.c_offset;
                        curviness /= 2.4;

                        return curviness;
                    };

                    return {
                        renderRelations: function() {
                            var rids = model.annotationData.getRelationIds();
                            renderer.jsPlumb.reset();

                            rids.forEach(function(rid) {
                                connectors[rid] = renderer.relations.renderRelation(rid);
                            });
                            renderer.relations.relationIdsSelected = [];
                        },

                        //only move position for window.resize.
                        renewConnections: function() {
                            var rids = model.annotationData.getRelationIds();

                            rids.forEach(function(rid) {
                                // recompute curviness
                                var sourceId = model.annotationData.relations[rid].subj;
                                var targetId = model.annotationData.relations[rid].obj;
                                var curviness = determineCurviness(sourceId, targetId);

                                if (sourceId == targetId) curviness = 30;

                                var conn = connectors[rid];
                                var label = conn.getLabel();
                                conn.endpoints[0].repaint();
                                conn.endpoints[1].repaint();
                                conn.setConnector(["Bezier", {
                                    curviness: curviness
                                }]);
                                conn.addOverlay(["Arrow", {
                                    width: 10,
                                    length: 12,
                                    location: 1
                                }]);

                            });
                        },

                        renderRelation: function(rid) {
                            var sourceId = model.annotationData.relations[rid].subj;
                            var targetId = model.annotationData.relations[rid].obj;
                            var curviness = determineCurviness(sourceId, targetId);

                            //  Determination of anchor points
                            var sourceAnchor = "TopCenter";
                            var targetAnchor = "TopCenter";

                            // In case of self-reference
                            if (sourceId == targetId) {
                                sourceAnchor = [0.5, 0, -1, -1];
                                targetAnchor = [0.5, 0, 1, -1];
                                curviness = 30;
                            }

                            // make connector
                            var pred = model.annotationData.relations[rid].pred;
                            var rgba = colorTrans(relationColor(pred), relationSettings.connOpacity);
                            var sourceElem = domSelector.entity.get(sourceId);
                            var targetElem = domSelector.entity.get(targetId);

                            var label = '[' + rid + '] ' + pred;

                            var conn = renderer.jsPlumb.connect({
                                source: sourceElem,
                                target: targetElem,
                                anchors: [sourceAnchor, targetAnchor],
                                connector: ["Bezier", {
                                    curviness: curviness
                                }],
                                paintStyle: model.connectorTypes[pred].paintStyle,
                                hoverPaintStyle: model.connectorTypes[pred].hoverPaintStyle,
                                tooltip: '[' + rid + '] ' + pred,
                                parameters: {
                                    "id": rid,
                                    "label": label
                                }
                            });

                            conn.addOverlay(["Arrow", {
                                width: 10,
                                length: 12,
                                location: 1
                            }]);
                            conn.setLabel({
                                label: label,
                                cssClass: "label"
                            });
                            conn.bind("click", controller.connectorClicked);
                            return conn;
                        },
                        isRelationSelected: function(rid) {
                            return (renderer.relations.relationIdsSelected.indexOf(rid) > -1);
                        },
                        selectRelation: function(rid) {
                            if (!renderer.relations.isRelationSelected(rid)) {
                                connectors[rid].setPaintStyle(model.connectorTypes[model.annotationData.relations[rid].pred + "_selected"].paintStyle);
                                renderer.relations.relationIdsSelected.push(rid);
                            }
                        },
                        deselectRelation: function(rid) {
                            var i = renderer.relations.relationIdsSelected.indexOf(rid);
                            if (i > -1) {
                                connectors[rid].setPaintStyle(model.connectorTypes[model.annotationData.relations[rid].pred].paintStyle);
                                renderer.relations.relationIdsSelected.splice(i, 1);
                            }
                        },
                        clearRelationSelection: function() {
                            while (renderer.relations.relationIdsSelected.length > 0) {
                                var rid = renderer.relations.relationIdsSelected.pop();
                                connectors[rid].setPaintStyle(model.connectorTypes[model.annotationData.relations[rid].pred].paintStyle);
                            }
                        },
                        destroyRelation: function(rid) {
                            var c = connectors[rid];
                            renderer.jsPlumb.detach(c);
                        },

                    };
                }(),
            };
        }(this);

        //handle user input event.
        var controller = function(editor) {
            var cancelBubble = function(e) {
                e = e || window.event;
                e.cancelBubble = true;
                e.bubbles = false;
                if (e.stopPropagation) e.stopPropagation();
            };

            var bodyClicked = function(e) {
                var getPosition = function(node) {
                    // assumption: text_box only includes <p> elements that contains <span> elements that represents model.annotationData.spans.
                    var $parent = $(node).parent();
                    var parentId = $parent.attr("id");

                    var pos;
                    if ($parent.hasClass("textae-editor__body__text-box__paragraph")) {
                        pos = renderer.paragraphs[parentId].begin;
                    } else if ($parent.hasClass("textae-editor__span")) {
                        pos = model.annotationData.spans[parentId].begin;
                    } else {
                        console.log(parentId);
                        return;
                    }

                    var childNodes = node.parentElement.childNodes;
                    for (var i = 0; childNodes[i] != node; i++) { // until the focus node
                        pos += (childNodes[i].nodeName == "#text") ? childNodes[i].nodeValue.length : $('#' + childNodes[i].id).text().length;
                    }

                    return pos;
                };

                var getFocusPosition = function(selection) {
                    var pos = getPosition(selection.focusNode);
                    return pos += selection.focusOffset;
                };

                var getAnchorPosition = function(selection) {
                    var pos = getPosition(selection.anchorNode);
                    return pos + selection.anchorOffset;
                };

                // adjust the beginning position of a span
                var adjustSpanBegin = function(beginPosition) {
                    var pos = beginPosition;
                    while (spanConfig.isNonEdgeCharacter(model.sourceDoc.charAt(pos))) {
                        pos++;
                    }
                    while (!spanConfig.isDelimiter(model.sourceDoc.charAt(pos)) && pos > 0 && !spanConfig.isDelimiter(model.sourceDoc.charAt(pos - 1))) {
                        pos--;
                    }
                    return pos;
                };

                // adjust the end position of a span
                var adjustSpanEnd = function(endPosition) {
                    var pos = endPosition;
                    while (spanConfig.isNonEdgeCharacter(model.sourceDoc.charAt(pos - 1))) {
                        pos--;
                    }
                    while (!spanConfig.isDelimiter(model.sourceDoc.charAt(pos)) && pos < model.sourceDoc.length) {
                        pos++;
                    }
                    return pos;
                };

                // adjust the beginning position of a span for shortening
                var adjustSpanBegin2 = function(beginPosition) {
                    var pos = beginPosition;
                    while ((pos < model.sourceDoc.length) && (spanConfig.isNonEdgeCharacter(model.sourceDoc.charAt(pos)) || !spanConfig.isDelimiter(model.sourceDoc.charAt(pos - 1)))) {
                        pos++;
                    }
                    return pos;
                };

                // adjust the end position of a span for shortening
                var adjustSpanEnd2 = function(endPosition) {
                    var pos = endPosition;
                    while ((pos > 0) && (spanConfig.isNonEdgeCharacter(model.sourceDoc.charAt(pos - 1)) || !spanConfig.isDelimiter(model.sourceDoc.charAt(pos)))) {
                        pos--;
                    }
                    return pos;
                };

                var moveSpan = function(spanId, begin, end) {
                    var commands = [];
                    var new_sid = idFactory.makeSpanId(begin, end);
                    if (!model.annotationData.spans[new_sid]) {
                        commands.push({
                            action: 'remove_span',
                            id: spanId
                        });
                        commands.push({
                            action: 'new_span',
                            id: new_sid,
                            begin: begin,
                            end: end
                        });
                        model.annotationData.spans[spanId].getTypes().forEach(function(type) {
                            type.entities.forEach(function(entityId) {
                                commands.push({
                                    action: 'new_denotation',
                                    id: entityId,
                                    span: new_sid,
                                    type: type.name
                                });
                            });
                        });
                    }

                    return commands;
                };

                var expandSpan = function(sid, selection) {
                    var commands = [];

                    var focusPosition = getFocusPosition(selection);

                    var range = selection.getRangeAt(0);
                    var anchorRange = document.createRange();
                    anchorRange.selectNode(selection.anchorNode);

                    if (range.compareBoundaryPoints(Range.START_TO_START, anchorRange) < 0) {
                        // expand to the left
                        var newBegin = adjustSpanBegin(focusPosition);
                        commands = moveSpan(sid, newBegin, model.annotationData.spans[sid].end);
                    } else {
                        // expand to the right
                        var newEnd = adjustSpanEnd(focusPosition);
                        commands = moveSpan(sid, model.annotationData.spans[sid].begin, newEnd);
                    }

                    command.execute(commands);
                };

                var shortenSpan = function(sid, selection) {
                    var commands = [];

                    var focusPosition = getFocusPosition(selection);

                    var range = selection.getRangeAt(0);
                    var focusRange = document.createRange();
                    focusRange.selectNode(selection.focusNode);

                    var removeSpan = function(sid) {
                        var commands = [];
                        commands.push({
                            action: 'remove_span',
                            id: sid
                        });
                        return commands;
                    };

                    var new_sid, tid, eid, type;
                    if (range.compareBoundaryPoints(Range.START_TO_START, focusRange) > 0) {
                        // shorten the right boundary
                        var newEnd = adjustSpanEnd2(focusPosition);

                        if (newEnd > model.annotationData.spans[sid].begin) {
                            new_sid = idFactory.makeSpanId(model.annotationData.spans[sid].begin, newEnd);
                            if (model.annotationData.spans[new_sid]) {
                                commands = removeSpan(sid);
                            } else {
                                commands = moveSpan(sid, model.annotationData.spans[sid].begin, newEnd);
                            }
                        } else {
                            domSelector.span.select(sid);
                            businessLogic.removeSelectedElements();
                        }
                    } else {
                        // shorten the left boundary
                        var newBegin = adjustSpanBegin2(focusPosition);

                        if (newBegin < model.annotationData.spans[sid].end) {
                            new_sid = idFactory.makeSpanId(newBegin, model.annotationData.spans[sid].end);
                            if (model.annotationData.spans[new_sid]) {
                                commands = removeSpan(sid);
                            } else {
                                commands = moveSpan(sid, newBegin, model.annotationData.spans[sid].end);
                            }
                        } else {
                            domSelector.span.select(sid);
                            businessLogic.removeSelectedElements();
                        }
                    }

                    command.execute(commands);
                };

                var selection = window.getSelection();
                if (selection) {
                    var range = selection.getRangeAt(0);

                    if (
                        // when the whole div is selected by e.g., triple click
                        (range.startContainer == editor.getSourceDocArea().get(0)) ||
                        // when Shift is pressed
                        (e.shiftKey) ||
                        // when nothing is selected
                        (selection.isCollapsed)
                    ) {
                        // bubbles go up
                        presentationLogic.cancelSelect();
                        domSelector.dismissBrowserSelection();
                        return true;
                    }

                    var anchorPosition = getAnchorPosition(selection);
                    var focusPosition = getFocusPosition(selection);

                    // no boundary crossing: normal -> create a entity
                    var sid;
                    if (selection.anchorNode.parentElement.id === selection.focusNode.parentElement.id) {
                        domSelector.unselect();

                        // switch the position when the selection is made from right to left
                        if (anchorPosition > focusPosition) {
                            var tmpPos = anchorPosition;
                            anchorPosition = focusPosition;
                            focusPosition = tmpPos;
                        }

                        // when the whole text is selected by e.g., triple click (Chrome)
                        if ((anchorPosition === 0) && (focusPosition == model.sourceDoc.length)) {
                            // do nothing. bubbles go up
                            return true;
                        }

                        var beginPosition = adjustSpanBegin(anchorPosition);
                        var endPosition = adjustSpanEnd(focusPosition);
                        sid = idFactory.makeSpanId(beginPosition, endPosition);

                        if (!model.annotationData.spans[sid]) {
                            if (endPosition - beginPosition > CONSTS.BLOCK_THRESHOLD) {
                                command.execute([{
                                    action: 'new_span',
                                    id: sid,
                                    begin: beginPosition,
                                    end: endPosition
                                }]);
                            } else {
                                var commands = [{
                                    action: 'new_span',
                                    id: sid,
                                    begin: beginPosition,
                                    end: endPosition
                                }];

                                if (editorState.isReplicateAuto) {
                                    var replicates = command.create.replicateSpanCommands({
                                        begin: beginPosition,
                                        end: endPosition
                                    });
                                    commands = commands.concat(replicates);
                                }
                                command.execute(commands);
                            }
                        }
                    }

                    // boundary crossing: exception
                    else {
                        if (selection.anchorNode.parentNode.parentNode == selection.focusNode.parentNode) {
                            domSelector.unselect();
                            expandSpan(selection.anchorNode.parentNode.id, selection);
                        } else if (selection.anchorNode.parentNode == selection.focusNode.parentNode.parentNode) {
                            domSelector.unselect();
                            shortenSpan(selection.focusNode.parentNode.id, selection);
                        } else if (domSelector.span.getNumberOfSelected() == 1) {
                            sid = domSelector.span.popSelectedId();

                            // drag began inside the selected span (expansion)
                            if ((anchorPosition > model.annotationData.spans[sid].begin) && (anchorPosition < model.annotationData.spans[sid].end)) {
                                // The focus node should be at one level above the selected node.
                                if ($('#' + sid).get(0).parentNode.id == selection.focusNode.parentNode.id) expandSpan(sid, selection);
                                else {
                                    domSelector.span.select(sid);
                                    alert('A span cannot be expanded to make a boundary crossing.');
                                }
                            }

                            // drag ended inside the selected span (shortening)
                            else if ((focusPosition > model.annotationData.spans[sid].begin) && (focusPosition < model.annotationData.spans[sid].end)) {
                                if ($('#' + sid).get(0).id == selection.focusNode.parentNode.id) shortenSpan(sid, selection);
                                else {
                                    domSelector.span.select(sid);
                                    alert('A span cannot be shrinked to make a boundary crossing.');
                                }
                            } else alert('It is ambiguous for which span you want to adjust the boundary. Reselect the span, and try again.');
                        } else {
                            alert('It is ambiguous for which span you want to adjust the boundary. Select the span, and try again.');
                        }
                    }
                }

                domSelector.dismissBrowserSelection();
                cancelBubble(e);
            };

            var spanClicked = function(e) {
                presentationLogic.hidePallet();
                var selection = window.getSelection();
                var range = selection.getRangeAt(0);

                if (!selection.isCollapsed) {
                    if (e.shiftKey && domSelector.span.getNumberOfSelected() == 1) {
                        //select reange of spans.
                        var firstId = domSelector.span.popSelectedId();
                        var secondId = $(this).attr('id');

                        domSelector.dismissBrowserSelection();
                        domSelector.unselect();

                        model.annotationData.getRangeOfSpan(firstId, secondId).forEach(function(spanId) {
                            domSelector.span.select(spanId);
                        });

                        editorState.buttonState.updateBySpan();
                    } else {
                        // if drag, bubble up
                        return true;
                    }
                } else if (e.ctrlKey) {
                    domSelector.domElement.toggle(e.target);
                    editorState.buttonState.updateBySpan();
                } else {
                    domSelector.domElement.selectOnly(e.target);
                    editorState.buttonState.updateAll();
                }

                return false;
            };

            // event handler (entity is clicked)
            var entityClicked = function(e) {
                if (e.ctrlKey) {
                    domSelector.domElement.toggle(e.target);
                    editorState.buttonState.updateByEntity();
                } else {
                    domSelector.domElement.selectOnly(e.target);
                    editorState.buttonState.updateAll();
                }

                cancelBubble(e);
                return false;
            };

            var gridMouseHover = function(event) {
                var $grid = $(this);
                var gridId = $grid.attr('id');

                if (event.type == 'mouseover') {
                    $grid.css('height', 'auto');
                    if ($grid.outerWidth() < renderer.positions.grid[gridId].width) {
                        $grid.css('width', renderer.positions.grid[gridId].width);
                    }
                } else {
                    $grid.css('height', renderer.positions.grid[gridId].height);
                }
            };

            var editorSelected = function() {
                editor.tool.selectMe();
                editorState.buttonState.renderEnable();
            };

            return {
                //bind user input event to handler
                init: function() {
                    editor
                        .on('mouseup', '.textae-editor__body', bodyClicked)
                        .on('mouseup', '.textae-editor__span', spanClicked)
                        .on('mouseup', '.textae-editor__entity', entityClicked)
                        .on('mouseover mouseout', '.textae-editor__grid', gridMouseHover)
                        .on('mouseup', '.textae-editor__body,.textae-editor__span,.textae-editor__grid,.textae-editor__entity', editorSelected);
                },

                //connector clicked is bind by jsPlumb bind function.
                connectorClicked: function(conn, e) {
                    var rid = conn.getParameter("id");

                    domSelector.unselect();

                    if (renderer.relations.isRelationSelected(rid)) {
                        renderer.relations.deselectRelation(rid);
                    } else {
                        if (!e.ctrlKey) {
                            renderer.relations.clearRelationSelection();
                        }
                        renderer.relations.selectRelation(rid);
                    }

                    cancelBubble(e);
                    return false;
                },
            };
        }(this);

        var domSelector = {
            // dismiss the default selection by the browser
            dismissBrowserSelection: function() {
                var selection = window.getSelection();
                selection.collapse(document.body, 0);
            },
            getSelecteds: function() {
                return $('.ui-selected');
            },
            hasSelecteds: function() {
                return domSelector.getSelecteds().length > 0;
            },
            unselect: function() {
                domSelector.getSelecteds().removeClass('ui-selected');
                renderer.relations.clearRelationSelection();
                editorState.buttonState.updateAll();
            },
            domElement: function() {
                var isSelected = function(target) {
                    return $(target).hasClass('ui-selected');
                };
                var select = function(target) {
                    $(target).addClass('ui-selected');
                };
                var deselect = function(target) {
                    $(target).removeClass('ui-selected');
                };
                return {
                    toggle: function(target) {
                        if (isSelected(target)) {
                            deselect(target);
                        } else {
                            select(target);
                        }
                    },
                    selectOnly: function(target) {
                        domSelector.getSelecteds().removeClass('ui-selected');
                        renderer.relations.clearRelationSelection();
                        select(target);
                    }
                };
            }(),
            span: {
                getSelecteds: function() {
                    return $('.textae-editor__span.ui-selected');
                },
                getNumberOfSelected: function() {
                    return domSelector.span.getSelecteds().length;
                },
                getSelectedId: function() {
                    //return first element id even if multi elements selected.
                    return domSelector.span.getSelecteds().attr('id');
                },
                popSelectedId: function() {
                    var ss = domSelector.span.getSelecteds();
                    if (ss.length === 1) {
                        ss.removeClass('ui-selected');
                        return ss.attr('id');
                    } else {
                        return null;
                    }
                },
                select: function(id) {
                    $('#' + id).addClass('ui-selected');
                    editorState.buttonState.updateBySpan();
                },
            },
            entity: {
                get: function(eid) {
                    return $('#' + idFactory.makeEntityDomId(eid));
                },
                getSelecteds: function() {
                    return $('.textae-editor__entity.ui-selected');
                },
                getNumberOfSelected: function() {
                    return domSelector.entity.getSelecteds().length;
                },
                hasSelecteds: function() {
                    return domSelector.entity.getNumberOfSelected() > 0;
                },
                getSelectedId: function() {
                    return domSelector.entity.getSelecteds().attr('title');
                },
                select: function(eid) {
                    domSelector.entity.get(eid).addClass('ui-selected');
                },
            },
        };

        //user event to edit model
        var businessLogic = {
            loadAnnotation: function(annotation) {
                var parseAnnotationJson = function parseAnnotationJson(data) {
                    //validate
                    if (data.text === undefined) {
                        alert("read failed.");
                        return;
                    }

                    //parse a souce document.
                    model.sourceDoc = data.text;

                    //parse denotaitons.
                    model.annotationData.reset();
                    model.annotationData.parseParagraphs(data.text);
                    model.annotationData.parseDenotations(data.denotations);
                    model.annotationData.parseRelations(data.relations);
                    if (data.denotations !== undefined) {
                        data.denotations.forEach(function(d) {
                            //d.obj is type of entity.
                            model.entityTypes.incrementNumberOfTypes(d.obj);
                        });
                    }

                    //parse relations.
                    relationsPerEntity = {};
                    connectors = {};
                    if (data.relations !== undefined) {
                        data.relations.forEach(function(r) {
                            if (!model.relationTypes[r.pred]) {
                                model.relationTypes[r.pred] = {};
                            }

                            if (model.relationTypes[r.pred].count) {
                                model.relationTypes[r.pred].count++;
                            } else {
                                model.relationTypes[r.pred].count = 1;
                            }

                            if (relationsPerEntity[r.subj]) {
                                if (relationsPerEntity[r.subj].indexOf(r.id) < 0) {
                                    relationsPerEntity[r.subj].push(r.id);
                                }
                            } else {
                                relationsPerEntity[r.subj] = [r.id];
                            }

                            if (relationsPerEntity[r.obj]) {
                                if (relationsPerEntity[r.obj].indexOf(r.id) < 0) {
                                    relationsPerEntity[r.obj].push(r.id);
                                }
                            } else {
                                relationsPerEntity[r.obj] = [r.id];
                            }
                        });
                    }
                };

                parseAnnotationJson(annotation);
                command.history.init();

                renderer.renderAnnotation();
            },
            saveHistory: function() {
                command.history.saved();
            },
            undo: function() {
                var revertCommand = function(command) {
                    var reverted = Object.create(command);
                    switch (command.action) {
                        case 'new_span':
                            reverted.action = 'remove_span';
                            break;
                        case 'remove_span':
                            reverted.action = 'new_span';
                            break;
                        case 'new_denotation':
                            reverted.action = 'remove_denotation';
                            break;
                        case 'remove_denotation':
                            reverted.action = 'new_denotation';
                            break;
                        case 'change_entity_type':
                            reverted.old_type = command.new_type;
                            reverted.new_type = command.old_type;
                            break;
                        case 'new_relation':
                            reverted.action = 'remove_relation';
                            break;
                        case 'remove_relation':
                            reverted.action = 'new_relation';
                            break;
                        case 'change_relation_subj':
                            reverted.old_subj = command.new_subj;
                            reverted.new_subj = command.old_subj;
                            break;
                        case 'change_relation_obj':
                            reverted.old_obj = command.new_obj;
                            reverted.new_obj = command.old_obj;
                            break;
                        case 'change_relation_pred':
                            reverted.old_pred = command.new_pred;
                            reverted.new_pred = command.old_pred;
                            break;
                    }
                    return reverted;
                };

                var getRevertCommands = function(commands) {
                    commands = Object.create(commands);
                    commands.reverse();
                    return commands.map(revertCommand);
                };

                if (command.history.hasAnythingToUndo()) {
                    domSelector.unselect();
                    renderer.relations.clearRelationSelection();

                    command.execute(getRevertCommands(command.history.prev()), 'undo');
                    businessLogic.undo();
                }
            },

            redo: function() {
                if (command.history.hasAnythingToRedo()) {
                    domSelector.unselect();
                    renderer.relations.clearRelationSelection();

                    command.execute(command.history.next(), 'redo');
                }
            },

            replicate: function() {
                if (domSelector.span.getNumberOfSelected() == 1) {
                    command.execute(command.create.replicateSpanCommands(model.annotationData.spans[domSelector.span.getSelectedId()]));
                } else alert('You can replicate span annotation when there is only span selected.');
            },

            createEntity: function() {
                var commands = [];
                domSelector.span.getSelecteds().each(function() {
                    var sid = this.id;
                    commands.push({
                        action: 'new_denotation',
                        span: sid,
                        type: model.entityTypes.getDefaultType()
                    });
                });

                command.execute(commands);
            },

            newLabel: function() {
                var $selectedEntities = domSelector.entity.getSelecteds();
                if ($selectedEntities.length > 0) {
                    var new_type = prompt("Please enter a new label", "");

                    var commands = [];
                    $selectedEntities.each(function() {
                        var eid = this.title;
                        console.log(eid);
                        commands.push({
                            action: 'change_entity_type',
                            id: eid,
                            old_type: model.annotationData.entities[eid].type,
                            new_type: new_type
                        });
                    });

                    command.execute(commands);
                }
            },

            removeSelectedElements: function() {
                var removeCommand = {
                    spans: [],
                    entities: [],
                    relations: [],
                    getAll: function() {
                        return removeCommand.relations.concat(removeCommand.entities, removeCommand.spans);
                    },
                };

                var removeEnitity = function(eid) {
                    removeCommand.entities.push(command.create.removeEntityCommand(eid));
                    if (relationsPerEntity[eid]) {
                        Array.prototype.push.apply(removeCommand.relations, relationsPerEntity[eid].map(command.create.removeRelationCommand));
                    }
                };

                //remove spans
                domSelector.span.getSelecteds().each(function() {
                    var spanId = this.id;
                    removeCommand.spans.push(command.create.removeSpanCommand(spanId));

                    model.annotationData.spans[spanId].getTypes().forEach(function(type) {
                        type.entities.forEach(function(entityId) {
                            removeEnitity(entityId);
                        });
                    });
                });

                //remove entities
                domSelector.entity.getSelecteds().each(function() {
                    //an entity element has the entityId in title. an id is per Editor.
                    removeEnitity(this.title);
                });

                //remove relations
                Array.prototype.push.apply(removeCommand.relations, renderer.relations.relationIdsSelected.map(command.create.removeRelationCommand));
                renderer.relations.relationIdsSelected = [];

                command.execute(removeCommand.getAll());
            },

            copyEntities: function() {
                clipBoard.length = 0;
                domSelector.entity.getSelecteds().each(function() {
                    clipBoard.push(this.title);
                });
            },

            pasteEntities: function() {
                var commands = [];
                domSelector.span.getSelecteds().each(function() {
                    var sid = this.id;
                    //clipBoard has entity ids.
                    commands = commands.concat(clipBoard.map(function(e) {
                        return {
                            action: 'new_denotation',
                            span: sid,
                            type: model.annotationData.entities[e].type
                        };
                    }));
                });

                command.execute(commands);
            },

            // set the default type of denoting object
            setEntityTypeDefault: function() {
                model.entityTypes.setDefaultType($(this).attr('label'));
                return false;
            },

            // set the type of an entity
            setEntityType: function() {
                var new_type = $(this).attr('label');
                var commands = [];
                domSelector.entity.getSelecteds().each(function() {
                    var eid = this.title;
                    commands.push({
                        action: 'change_entity_type',
                        id: eid,
                        old_type: model.annotationData.entities[eid].type,
                        new_type: new_type
                    });
                });

                command.execute(commands);
                return false;
            }
        };

        //this object respose to save and load data.
        var dataAccessObject = function(self) {
            //load/saveDialog
            var loadSaveDialog = function() {
                var getLoadDialog = function() {
                    var $content = $('<div>')
                        .append('<div>Sever :<input type="text" class="textae-editor__load-dialog__file-name" /><input type="button" value="OK" /></div>')
                        .append('<div>Local :<input type="file"　/></div>')
                        .on('change', '[type="file"]',
                            function() {
                                dataAccessObject.getAnnotationFromFile(this);
                                $content.dialogClose();
                            })
                        .on('click', '[type="button"]',
                            function() {
                                var url = $content.find('.textae-editor__load-dialog__file-name').val();
                                dataAccessObject.getAnnotationFromServer(url);
                                $content.dialogClose();
                            });

                    return textAeUtil.getDialog('textae.dialog.load', 'Load document with annotation.', $content);
                };

                var getSaveDialog = function() {
                    var $content = $('<div>')
                        .append('<div>Sever :<input type="text" class="textae-editor__save-dialog__file-name" /><input type="button" value="OK" /></div>')
                        .append('<div>Local :<span class="span_link_place"><a target="_blank"/></span></div>')
                        .on('click', 'a', function() {
                            businessLogic.saveHistory();
                            $content.dialogClose();
                        })
                        .on('click', '[type="button"]', function() {
                            var url = $content.find('.textae-editor__save-dialog__file-name').val();
                            dataAccessObject.saveAnnotationToServer(url);
                            $content.dialogClose();
                        });

                    return textAeUtil.getDialog('textae.dialog.save', 'Save document with annotation.', $content);
                };

                return {
                    showLoad: function(url) {
                        getLoadDialog().open(url);
                    },
                    showSave: function(url, downloadPath) {
                        var createFileLink = function($save_dialog, downloadPath) {
                            var $fileInput = getLoadDialog().find("input[type='file']");

                            var file = $fileInput.prop('files')[0];
                            var name = file ? file.name : 'annotations.json';
                            var link = $save_dialog.find('a')
                                .text(name)
                                .attr('href', downloadPath)
                                .attr('download', name);
                        };

                        var $dialog = getSaveDialog();

                        //create local link
                        createFileLink($dialog, downloadPath);

                        //open dialog
                        $dialog.open(url);
                    }
                };
            }();

            var getMessageArea = function() {
                $messageArea = self.find('.textae-editor__footer .textae-editor__footer__message');
                if ($messageArea.length === 0) {
                    $messageArea = $("<div>").addClass("textae-editor__footer__message");
                    var $footer = $("<div>")
                        .addClass("textae-editor__footer")
                        .append($messageArea);
                    self.append($footer);
                }

                return $messageArea;
            };

            var showSaveSuccess = function() {
                getMessageArea().html("annotation saved").fadeIn().fadeOut(5000, function() {
                    $(this).html('').removeAttr('style');
                    setDataSourceUrl(dataSourceUrl);
                });
                command.history.saved();
                cursor.endWait();
            };

            var showSaveError = function() {
                getMessageArea.html("could not save").fadeIn().fadeOut(5000, function() {
                    $(this).html('').removeAttr('style');
                    setDataSourceUrl(dataSourceUrl);
                });
                cursor.endWait();
            };

            var setDataSourceUrl = function(url) {
                if (url !== "") {
                    var targetDoc = url.replace(/\/annotations\.json$/, '');
                    getMessageArea().html("(Target: <a href='" + targetDoc + "'>" + targetDoc + "</a>)");
                    dataSourceUrl = url;
                }
            };

            var dataSourceUrl = "";

            return {
                getAnnotationFromServer: function(url) {
                    cursor.startWait();
                    textAeUtil.ajaxAccessor.getAsync(url, function(data) {
                        businessLogic.loadAnnotation(data);
                        setDataSourceUrl(url);
                    }, function() {
                        cursor.endWait();
                    });
                },
                getAnnotationFromFile: function(fileEvent) {
                    var reader = new FileReader();
                    reader.onload = function() {
                        var annotation = JSON.parse(this.result);
                        businessLogic.loadAnnotation(annotation);
                    };
                    reader.readAsText(fileEvent.files[0]);
                },
                saveAnnotationToServer: function(url) {
                    cursor.startWait();
                    var postData = model.annotationData.toJason();
                    textAeUtil.ajaxAccessor.post(url, postData, showSaveSuccess, showSaveError, function() {
                        cursor.endWait();
                    });
                    businessLogic.saveHistory();
                },
                showAccess: function() {
                    loadSaveDialog.showLoad(dataSourceUrl);
                },
                showSave: function() {
                    var createSaveFile = function(contents) {
                        var blob = new Blob([contents], {
                            type: 'application/json'
                        });
                        return URL.createObjectURL(blob);
                    };

                    loadSaveDialog.showSave(dataSourceUrl, createSaveFile(model.annotationData.toJason()));
                },
            };
        }(this);

        //user event that does not change data.
        var presentationLogic = function(self) {
            return {
                showPallet: function(point) {
                    //create table contents for entity type.
                    var makeEntityTypeOfEntityTypePallet = function() {
                        return model.entityTypes.getSortedNames().map(function(t) {
                            var type = model.entityTypes.getType(t);
                            var row = '<tr class="textae-editor__entity-pallet__entity-type" style="background-color:' + type.getColor() + '">';

                            row += '<th><input type="radio" name="etype" class="textae-editor__entity-pallet__entity-type__radio" label="' + t + '"';
                            row += (t == model.entityTypes.getDefaultType()) ? ' title="default type" checked' : '';
                            row += '/></th>';

                            row += '<td class="textae-editor__entity-pallet__entity-type__label" label="' + t + '">' + t + '</td>';

                            row += '<th title="' + uri + '">';

                            var uri = type.uri;
                            if (uri) {
                                row += '<a href="' + uri + '" target="_blank"><img src="images/link.png"/></a>';
                            }

                            row += '</th>';
                            row += '</tr>';
                            return row;
                        }).join();
                    };

                    //return a Pallet that created if not exists.
                    var getEmptyPallet = function() {
                        var $pallet = $('.textae-editor__entity-pallet');
                        if ($pallet.length === 0) {
                            //setup new pallet
                            $pallet = $('<div>')
                                .addClass("textae-editor__entity-pallet")
                                .append($('<table>'))
                                .css({
                                    'position': 'fixed',
                                    'display': 'none'
                                })
                                .on('mouseup', '.textae-edtior__entity-pallet__entity-type__radio', businessLogic.setEntityTypeDefault)
                                .on('click', '.textae-editor__entity-pallet__entity-type__label', function() {
                                    presentationLogic.hidePallet();
                                    businessLogic.setEntityType.call(this);
                                });

                            //for show on top append to body.
                            $("body").append($pallet);
                        } else {
                            $pallet.find('table').empty();
                            $pallet.css('width', 'auto');
                        }
                        return $pallet;
                    };

                    var $pallet　 = getEmptyPallet();
                    $pallet.find("table")
                        .append(makeEntityTypeOfEntityTypePallet(model.entityTypes));

                    //limti max height.
                    if ($pallet.outerHeight() > CONSTS.PALLET_HEIGHT_MAX) {
                        $pallet.css('height', CONSTS.PALLET_HEIGHT_MAX);
                        $pallet.css('width', $pallet.outerWidth() + 30);
                    }

                    //if open by mouseevent
                    if (arguments.length === 1) {
                        $pallet.css('top', point.top);
                        $pallet.css('left', point.left);
                    } else {
                        $pallet.css('top', 10);
                        $pallet.css('left', 20);
                    }
                    $pallet.css('display', 'block');
                },
                hidePallet: function() {
                    $('.textae-editor__entity-pallet').css('display', 'none');
                },
                redraw: function() {
                    var stickGridOnSpan = function(spanId) {
                        var gridId = 'G' + spanId;
                        var $grid = $('#' + gridId);
                        if ($grid.length > 0) {
                            spanPosition = renderer.positions.span[spanId];
                            gridPosition = renderer.positions.grid[gridId];

                            var newTop = spanPosition.top - gridPosition.offset - gridPosition.height;
                            $grid.css('top', newTop);
                            gridPosition.top = newTop;

                            var newLeft = spanPosition.left;
                            $grid.css('left', newLeft);
                            gridPosition.left = newLeft;
                        }
                    };

                    //sitck all grid on span.
                    model.annotationData.getAllSpan().forEach(function(span) {
                        renderer.positions.indexPositionSpan(span.id);
                        stickGridOnSpan(span.id);
                    });

                    //calculate positions of all entity.
                    Object.keys(model.annotationData.entities).forEach(function(id) {
                        renderer.positions.indexPositionEntity(id);
                    });

                    renderer.relations.renewConnections();
                },
                cancelSelect: function() {
                    // if drag, bubble up
                    if (!window.getSelection().isCollapsed) {
                        domSelector.dismissBrowserSelection();
                        return true;
                    }

                    domSelector.unselect();
                    presentationLogic.hidePallet();
                    editorState.buttonState.updateAll();

                    self.tool.cancelSelect();
                },
                selectLeftSpan: function() {
                    if (domSelector.span.getNumberOfSelected() == 1) {
                        var span = model.annotationData.spans[domSelector.span.popSelectedId()];
                        domSelector.unselect();
                        if (span.left) {
                            domSelector.span.select(span.left.id);
                        }
                    }
                },
                selectRightSpan: function() {
                    if (domSelector.span.getNumberOfSelected() == 1) {

                        var span = model.annotationData.spans[domSelector.span.popSelectedId()];
                        domSelector.unselect();
                        if (span.right) {
                            domSelector.span.select(span.right.id);
                        }
                    }
                },
                showSettingDialog: function() {
                    var $content = $('<div>')
                        .append($('<div>')
                            .append('<label>Line Height:')
                            .append($('<input>')
                                .attr({
                                    'type': 'number',
                                    'step': 1,
                                    'min': 3,
                                    'max': 10,
                                    'value': 4,
                                })
                                .addClass('textae-editor__setting-dialog__line-height')
                            ))
                        .on('change', '.textae-editor__setting-dialog__line-height', function() {
                            var value = $(this).val();
                            self.find('.textae-editor__body__text-box').css({
                                'line-height': value * 100 + '%'
                            });
                            presentationLogic.redraw();
                        });
                    textAeUtil.getDialog('textae.dialog.setting', 'Chage Settings', $content, true).open();
                },
            };
        }(this);

        // public funcitons of editor
        var editorApi = {
            start: function() {
                startEdit();
            },
            handleKeyInput: function(key) {
                var keyApiMap = {
                    'A': dataAccessObject.showAccess,
                    'C': businessLogic.copyEntities,
                    'D': businessLogic.removeSelectedElements,
                    'DEL': businessLogic.removeSelectedElements,
                    'E': businessLogic.createEntity,
                    'Q': presentationLogic.showPallet,
                    'R': businessLogic.replicate,
                    'S': dataAccessObject.showSave,
                    'V': businessLogic.pasteEntities,
                    'W': businessLogic.newLabel,
                    'X': businessLogic.redo,
                    'Y': businessLogic.redo,
                    'Z': businessLogic.undo,
                    'ESC': presentationLogic.cancelSelect,
                    'LEFT': presentationLogic.selectLeftSpan,
                    'RIGHT': presentationLogic.selectRightSpan,
                };
                if (keyApiMap[key]) {
                    keyApiMap[key]();
                }
            },
            handleButtonClick: function(event) {
                var buttonApiMap = {
                    'textae.control.button.read.click': dataAccessObject.showAccess,
                    'textae.control.button.write.click': dataAccessObject.showSave,
                    'textae.control.button.undo.click': businessLogic.undo,
                    'textae.control.button.redo.click': businessLogic.redo,
                    'textae.control.button.replicate.click': businessLogic.replicate,
                    'textae.control.button.replicate_auto.click': editorState.toggleReplicateAuto,
                    'textae.control.button.entity.click': businessLogic.createEntity,
                    'textae.control.button.new_label.click': businessLogic.newLabel,
                    'textae.control.button.pallet.click': function() {
                        presentationLogic.showPallet(event.point);
                    },
                    'textae.control.button.delete.click': businessLogic.removeSelectedElements,
                    'textae.control.button.copy.click': businessLogic.copyEntities,
                    'textae.control.button.paste.click': businessLogic.pasteEntities,
                    'textae.control.button.setting.click': presentationLogic.showSettingDialog,
                };
                buttonApiMap[event.name]();
            },
            redraw: presentationLogic.redraw,
        };
        this.api = editorApi;

        return this;
    };