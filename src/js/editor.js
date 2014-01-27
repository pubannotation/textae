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
                annotationData: function() {
                    var spanContainer;
                    var sortedSpanIds = null;
                    var entitiesPerType;

                    var updateSpanTree = function() {
                        // Sort id of spans by the position.
                        var sortedSpans = model.annotationData.getAllSpan().sort(function(a, b) {
                            return a.begin - b.begin || b.end - a.end;
                        });

                        // the spanTree has parent-child structure.
                        var spanTree = [];
                        sortedSpans.forEach(function(span, index, array) {
                            $.extend(span, {
                                // Reset children
                                children: [],
                                // Order by position
                                left: index !== 0 ? array[index - 1] : null,
                                right: index !== array.length - 1 ? array[index + 1] : null,
                            });

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
                        model.annotationData.spansTopLevel = spanTree;
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
                            // A big brother is brother node on a structure at rendered.
                            // There is no big brother if the span is first in a paragrpah.
                            // Warning: parent is set at updateSpanTree, is not exists now.
                            getBigBrother: function() {
                                var index;
                                if (this.parent) {
                                    index = this.parent.children.indexOf(this);
                                    return index === 0 ? null : this.parent.children[index - 1];
                                } else {
                                    index = model.annotationData.spansTopLevel.indexOf(this);
                                    return index === 0 || model.annotationData.spansTopLevel[index - 1].paragraph !== this.paragraph ? null : model.annotationData.spansTopLevel[index - 1];
                                }
                            },
                            // Get online for update is not grantieed.
                            getTypes: function() {
                                return $.map(this.types, function(value, key) {
                                    return {
                                        id: key,
                                        name: value,
                                        entities: Object.keys(entitiesPerType[key]),
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
                        if (!model.annotationData.getSpan(spanId)) {
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
                        entities: null,
                        relations: null,
                        reset: function() {
                            spanContainer = {};
                            model.annotationData.entities = {};
                            model.annotationData.relations = {};
                        },
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
                            return $.map(spanContainer, function(span) {
                                return span;
                            });
                        },
                        //expected entity like {id: "E21", span: "editor2__S50_54", type: "Protein"}.
                        addEntity: function(entity) {
                            //expect the span is alredy exists
                            var addEntityToSpan = function(entity) {
                                var addEntityToType = function(typeId, entityId) {
                                    if (!entitiesPerType[typeId]) {
                                        entitiesPerType[typeId] = {};
                                    }
                                    entitiesPerType[typeId][entityId] = null;
                                };

                                var typeId = idFactory.makeTypeId(entity.span, entity.type);
                                //span must have types as object.
                                model.annotationData.getSpan(entity.span).types[typeId] = entity.type;
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
                                delete entitiesPerType[typeId][entityId];

                                //remove type
                                if (Object.keys(entitiesPerType[typeId]).length === 0) {
                                    delete entitiesPerType[typeId];
                                    delete model.annotationData.getSpan(spanId).types[typeId];
                                }
                            };

                            var entity = model.annotationData.entities[entityId];
                            if (entity) {
                                removeEntityFromSpan(entity.span, entity.type, entityId);
                                delete model.annotationData.entities[entityId];
                            }
                            return entity;
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
                                var spanId = model.annotationData.entities[e].span;
                                var span = {
                                    'begin': model.annotationData.getSpan(spanId).begin,
                                    'end': model.annotationData.getSpan(spanId).end
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
                relationTypes: {},
                relationTypeDefault: '',
                setRelationTypes: function(relationTypes) {
                    if (relationTypes !== undefined) {
                        model.relationTypes = {};
                        model.relationTypeDefault = null;

                        relationTypes.forEach(function(type) {
                            model.relationTypes[type.name] = type;
                            if (type["default"] === true) {
                                model.relationTypeDefault = type.name;
                            }
                        });

                        if (!model.relationTypeDefault) {
                            model.relationTypeDefault = relationTypes[0].name;
                        }
                    }
                },
                initRelationsPerEntity: function(relations) {
                    if (relations !== undefined) {
                        relationsPerEntity = {};
                        relations.forEach(function(r) {
                            // Update model.relationTypes
                            if (!model.relationTypes[r.pred]) {
                                model.relationTypes[r.pred] = {};
                            }

                            if (model.relationTypes[r.pred].count) {
                                model.relationTypes[r.pred].count++;
                            } else {
                                model.relationTypes[r.pred].count = 1;
                            }

                            // initRelationsPerEntity
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
                },
                connectorTypes: {},
                initConnectorTypes: function() {
                    var getRelationColor = function(type) {
                        if (model.relationTypes[type] && model.relationTypes[type].color) {
                            return model.relationTypes[type].color;
                        } else {
                            return "#555555";
                        }
                    };

                    var converseHEXinotRGBA = function(color, opacity) {
                        var c = color.slice(1);
                        var r = c.substr(0, 2);
                        var g = c.substr(2, 2);
                        var b = c.substr(4, 2);
                        r = parseInt(r, 16);
                        g = parseInt(g, 16);
                        b = parseInt(b, 16);

                        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
                    };

                    model.connectorTypes = {};

                    for (var name in model.relationTypes) {
                        var colorHex = getRelationColor(name);
                        var paintRGBA = converseHEXinotRGBA(colorHex, renderer.relation.settings.connOpacity);
                        var hoverRGBA = converseHEXinotRGBA(colorHex, 1);

                        model.connectorTypes[name] = {
                            paintStyle: {
                                strokeStyle: paintRGBA,
                                lineWidth: 1
                            },
                            hoverPaintStyle: {
                                strokeStyle: hoverRGBA,
                                lineWidth: 3
                            }
                        };
                        model.connectorTypes[name + '_selected'] = {
                            paintStyle: {
                                strokeStyle: hoverRGBA,
                                lineWidth: 3
                            },
                            hoverPaintStyle: {
                                strokeStyle: hoverRGBA,
                                lineWidth: 3
                            }
                        };
                    }
                },
                getReplicationSpans: function(originSpan) {
                    // Get spans their stirng is same with the originSpan from sourceDoc.
                    var getSpansTheirStringIsSameWith = function(originSpan) {
                        var getNextStringIndex = String.prototype.indexOf.bind(model.sourceDoc, model.sourceDoc.substring(originSpan.begin, originSpan.end));
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
                        var precedingChar = model.sourceDoc.charAt(candidateSpan.begin - 1);
                        var followingChar = model.sourceDoc.charAt(candidateSpan.end);

                        return spanConfig.isDelimiter(precedingChar) && spanConfig.isDelimiter(followingChar);
                    };

                    // Is the candidateSpan is spaned already?
                    var isAlreadySpaned = function(candidateSpan) {
                        return model.annotationData.getAllSpan().filter(function(existSpan) {
                            return existSpan.begin === candidateSpan.begin && existSpan.end === candidateSpan.end;
                        }).length > 0;
                    };

                    // A span its range is coross over with other spans are not able to rendered.
                    // Because spans are renderd with span tag. Html tags can not be cross over.
                    var isBoundaryCrossingWithOtherSpans = function(candidateSpan) {
                        return model.annotationData.getAllSpan().filter(function(existSpan) {
                            return (existSpan.begin < candidateSpan.begin && candidateSpan.begin < existSpan.end && existSpan.end < candidateSpan.end) ||
                                (candidateSpan.begin < existSpan.begin && existSpan.begin < candidateSpan.end && candidateSpan.end < existSpan.end);
                        }).length > 0;
                    };

                    return getSpansTheirStringIsSameWith(originSpan).filter(function(span) {
                        return !isOriginSpan(span) && isWord(span) && !isAlreadySpaned(span) && !isBoundaryCrossingWithOtherSpans(span);
                    });
                },
            };
        }(this);

        // index
        var relationsPerEntity;

        // constant values
        var CONSTS = {
            BLOCK_THRESHOLD: 100,
            TYPE_MARGIN_TOP: 18,
            TYPE_MARGIN_BOTTOM: 2,
            PALLET_HEIGHT_MAX: 100
        };

        var startEdit = function startEdit() {
            var setTypeConfig = function(config) {
                model.entityTypes.set(config['entity types']);
                model.setRelationTypes(config['relation types']);

                if (config.css !== undefined) {
                    $('#css_area').html('<link rel="stylesheet" href="' + config.css + '"/>');
                }
            };

            var initState = function() {
                command.init(
                    function() {
                        // An event handler called when command.history is changed.
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
                    }
                );
                editorState.buttonState.updateAll();
            };

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

        // A command is an operation by user that is saved as history, and can undo and redo.
        // Users can edit model only via commands. 
        var command = function() {
            // histories of edit to undo and redo.
            var history = function() {
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
                        if (onChange !== undefined) {
                            onChangeFunc = onChange.bind(this);
                        }
                    },
                    reset: function() {
                        lastSaveIndex = -1;
                        lastEditIndex = -1;
                        history = [];
                        trigger();
                    },
                    push: function(commands) {
                        history.splice(lastEditIndex + 1, history.length - lastEditIndex, commands);
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
            }();

            return {
                init: function(onChange) {
                    history.init(onChange);
                    history.reset();
                },
                resetHistory: function() {
                    history.reset();
                },
                updateSavePoint: function() {
                    history.saved();
                },
                // Make isHistoryCommand true when 'undo' or 'redo'.
                invoke: function(commands, isHistoryCommand) {
                    if (commands && commands.length > 0) {
                        if (isHistoryCommand) {
                            domSelector.unselect();
                            renderer.relation.clearRelationSelection();
                        }

                        commands.forEach(function(command) {
                            command.execute();
                        });

                        presentationLogic.redraw();

                        if (!isHistoryCommand) {
                            history.push(commands);
                            editorState.buttonState.updateAll();
                        }
                    }
                },
                factory: function() {
                    var debugLog = function(message) {
                        // For debug
                        console.log('[command.invoke]', message);
                    };

                    return {
                        spanCreateCommand: function(newSpan) {
                            var id = idFactory.makeSpanId(newSpan.begin, newSpan.end);
                            return {
                                execute: function() {
                                    try {
                                        // model
                                        model.annotationData.addSpan({
                                            begin: newSpan.begin,
                                            end: newSpan.end
                                        });

                                        // rendering
                                        renderer.span.render(id);

                                        // select
                                        domSelector.span.select(id);

                                        debugLog('create a new span, spanId:' + id);
                                    } catch (e) {
                                        // Rollback model data unless dom create.
                                        model.annotationData.removeSpan(id);
                                        throw e;
                                    }
                                },
                                revert: command.factory.spanRemoveCommand.bind(null, id),
                            };
                        },
                        spanRemoveCommand: function(spanId) {
                            var span = model.annotationData.getSpan(spanId);
                            return {
                                execute: function() {
                                    // Save a span potision for undo
                                    this.begin = span.begin;
                                    this.end = span.end;
                                    // model
                                    model.annotationData.removeSpan(spanId);
                                    // rendering
                                    renderer.span.destroy(spanId);

                                    debugLog('remove a span, spanId:' + spanId);
                                },
                                revert: command.factory.spanCreateCommand.bind(null, {
                                    begin: span.begin,
                                    end: span.end
                                })
                            };
                        },
                        spanMoveCommand: function(spanId, begin, end) {
                            var commands = [];
                            var newSpanId = idFactory.makeSpanId(begin, end);
                            if (!model.annotationData.getSpan(newSpanId)) {
                                commands.push(command.factory.spanRemoveCommand(spanId));
                                commands.push(command.factory.spanCreateCommand({
                                    begin: begin,
                                    end: end
                                }));
                                model.annotationData.getSpan(spanId).getTypes().forEach(function(type) {
                                    type.entities.forEach(function(entityId) {
                                        commands.push(command.factory.entityCreateCommand(newSpanId, type.name, entityId));
                                    });
                                });
                            }
                            var oldBeginEnd = idFactory.parseSpanId(spanId);

                            return {
                                execute: function() {
                                    commands.forEach(function(command) {
                                        command.execute();
                                    });
                                    debugLog('move a span, spanId:' + spanId + ', newBegin:' + begin + ', newEnd:' + end);
                                },
                                revert: command.factory.spanMoveCommand.bind(null, newSpanId, oldBeginEnd.begin, oldBeginEnd.end),
                            };
                        },
                        spanReplicateCommand: function(span) {
                            var commands = model.getReplicationSpans(span)
                                .map(command.factory.spanCreateCommand);

                            return {
                                execute: function() {
                                    commands.forEach(function(command) {
                                        command.execute();
                                    });
                                    debugLog('replicate a span, begin:' + span.begin + ', end:' + span.end);
                                },
                                revert: function() {
                                    var revertedCommands = commands.map(function(command) {
                                        return command.revert();
                                    });
                                    return {
                                        execute: function() {
                                            revertedCommands.forEach(function(command) {
                                                command.execute();
                                            });
                                            debugLog('revert replicate a span, begin:' + span.begin + ', end:' + span.end);
                                        }
                                    };
                                }
                            };
                        },
                        entityCreateCommand: function(spanId, typeName, entityId) {
                            return {
                                execute: function() {
                                    // Overwrite to revert
                                    entityId = entityId || model.annotationData.getNewEntityId();
                                    // model
                                    var newEntity = {
                                        id: entityId,
                                        span: spanId,
                                        type: typeName
                                    };
                                    model.annotationData.addEntity(newEntity);
                                    // rendering
                                    renderer.entity.render(newEntity);
                                    // select
                                    domSelector.entity.select(entityId);

                                    debugLog('create a new entity, spanId:' + spanId + ', type:' + typeName + '  entityId:' + entityId);
                                },
                                revert: function() {
                                    // This function cannot be bound, because a new entity id is created at execute.
                                    return command.factory.entityRemoveCommand(entityId, spanId, typeName);
                                }
                            };
                        },
                        entityRemoveCommand: function(entityId, spanId, typeName) {
                            // The spanId and typeName of exist entity are neccesary to revert.
                            // The spanId and typeName are specified when this function is called from revert of createEntityCommand.
                            // Because a new entity is not exist yet.
                            var entity = model.annotationData.entities[entityId];
                            return {
                                execute: function() {
                                    // model
                                    var deleteEntity = model.annotationData.removeEnitity(entityId);
                                    // rendering
                                    renderer.entity.destroy(deleteEntity);

                                    debugLog('remove a entity, spanId:' + entity.span + ', type:' + entity.type + ', entityId:' + entityId);
                                },
                                revert: command.factory.entityCreateCommand.bind(null, spanId || entity.span, typeName || entity.type, entityId)
                            };
                        },
                        entityChangeTypeCommand: function(entityId, newType) {
                            return {
                                execute: function() {
                                    var changedEntity = model.annotationData.removeEnitity(entityId);
                                    var oldType = changedEntity.type;
                                    changedEntity.type = newType;
                                    model.annotationData.addEntity(changedEntity);
                                    // rendering
                                    renderer.entity.changeTypeOfExists(changedEntity);

                                    debugLog('change type of a entity, spanId:' + changedEntity.span + ', type:' + oldType + ', entityId:' + entityId + ', newType:' + newType);
                                },
                                revert: command.factory.entityChangeTypeCommand.bind(null, entityId, model.annotationData.entities[entityId].type)
                            };
                        },
                        relationCreateCommand: function(relationId, subject, object, predicate) {
                            return {
                                execute: function() {
                                    model.annotationData.relations[relationId] = {
                                        id: relationId,
                                        subj: subject,
                                        obj: object,
                                        pred: predicate
                                    };

                                    if (relationsPerEntity[subject]) {
                                        if (relationsPerEntity[subject].indexOf(relationId) < 0) {
                                            relationsPerEntity[subject].push(relationId);
                                        }
                                    } else {
                                        relationsPerEntity[subject] = [relationId];
                                    }

                                    if (relationsPerEntity[object]) {
                                        if (relationsPerEntity[object].indexOf(relationId) < 0) {
                                            relationsPerEntity[object].push(relationId);
                                        }
                                    } else {
                                        relationsPerEntity[object] = [relationId];
                                    }

                                    // rendering
                                    renderer.relation.render(relationId);

                                    // selection
                                    renderer.relation.selectRelation(relationId);

                                    debugLog('create a new relation relationId:' + relationId + ', subject:' + subject + ', object:' + object + ', predicate:' + predicate);
                                },
                                revert: command.factory.relationRemoveCommand.bind(null, relationId)
                            };
                        },
                        relationRemoveCommand: function(relationId) {
                            var relation = model.annotationData.relations[relationId];
                            var subject = relation.subj;
                            var object = relation.obj;
                            var predicate = relation.pred;

                            return {
                                execute: function() {
                                    // model
                                    delete model.annotationData.relations[relationId];

                                    console.log('before remove relation', relationsPerEntity);

                                    var relatinosOfSubject = relationsPerEntity[subject];
                                    relatinosOfSubject.splice(relatinosOfSubject.indexOf(relationId), 1);
                                    if (relatinosOfSubject.length === 0) {
                                        delete relationsPerEntity[subject];
                                    }
                                    var relatinosOfObject = relationsPerEntity[object];
                                    relatinosOfObject.splice(relatinosOfObject.indexOf(relationId), 1);
                                    if (relatinosOfObject.length === 0) {
                                        delete relationsPerEntity[object];
                                    }

                                    // rendering
                                    renderer.relation.destroy(relationId);

                                    debugLog('remove a relation relationId:' + relationId + ', subject:' + subject + ', object:' + object + ', predicate:' + predicate);
                                },
                                revert: command.factory.relationCreateCommand.bind(null, relationId, subject, object, predicate)
                            };
                        },
                        relationChangePredicateCommand: function(relationId, predicate) {
                            var oldPredicate = model.annotationData.relations[relationId].pred;
                            return {
                                execute: function() {
                                    // model
                                    model.annotationData.relations[relationId].pred = predicate;
                                    // rendering
                                    renderer.relation.cachedConnectors[relationId].setPaintStyle(model.connectorTypes[predicate + "_selected"].paintStyle);
                                    renderer.relation.cachedConnectors[relationId].setHoverPaintStyle(model.connectorTypes[predicate + "_selected"].hoverPaintStyle);
                                    renderer.relation.cachedConnectors[relationId].setLabel('[' + relationId + '] ' + predicate);
                                    // selection
                                    renderer.relation.selectRelation(relationId);
                                },
                                revert: command.factory.relationChangePredicateCommand.bind(null, relationId, oldPredicate)
                            };
                        },
                        //TODO: relationChangeSubjectCommand, relationChangeObjectCommand
                    };
                }(),
                undo: function() {
                    var getRevertCommands = function(commands) {
                        commands = Object.create(commands);
                        commands.reverse();
                        return commands.map(function(originCommand) {
                            return originCommand.revert();
                        });
                    };

                    if (history.hasAnythingToUndo()) {
                        command.invoke(getRevertCommands(history.prev()), true);
                    }
                },
                redo: function() {
                    if (history.hasAnythingToRedo()) {
                        command.invoke(history.next(), true);
                    }
                },
            };
        }();

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
                parseSpanId: function(spanId) {
                    var beginEnd = spanId.replace(editor.editorId + '__S', '').split('_');
                    return {
                        begin: beginEnd[0],
                        end: beginEnd[1]
                    };
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

        // Render DOM elements conforming with the Model.
        var renderer = function(editor) {
            var destroyGrid = function(spanId) {
                var gridId = domSelector.grid.get(spanId).remove().attr('id');
            };

            // Utility functions for get positions of elemnts.
            var positionUtils = {
                getSpan: function(spanId) {
                    var $span = domSelector.span.get(spanId);

                    if ($span.length === 0) {
                        throw new Error("span is not renderd : " + spanId);
                    }

                    return {
                        top: $span.get(0).offsetTop,
                        left: $span.get(0).offsetLeft,
                        width: $span.outerWidth(),
                        height: $span.outerHeight(),
                        center: $span.get(0).offsetLeft + $span.outerWidth() / 2,
                    };
                },
                getGrid: function(spanId) {
                    var $grid = domSelector.grid.get(spanId);
                    var gridElement = $grid.get(0);

                    return gridElement ? {
                        top: gridElement.offsetTop,
                        left: gridElement.offsetLeft,
                        height: $grid.outerHeight(),
                    } : {
                        top: 0,
                        left: 0,
                        height: 0
                    };
                },
                getEntity: function(entityId) {
                    var spanId = model.annotationData.entities[entityId].span;

                    var $entity = domSelector.entity.get(entityId);
                    if ($entity.length === 0) {
                        throw new Error("entity is not rendered : " + entityId);
                    }

                    var gridPosition = positionUtils.getGrid(spanId);
                    var entityElement = $entity.get(0);
                    return {
                        top: gridPosition.top + entityElement.offsetTop,
                        center: gridPosition.left + entityElement.offsetLeft + $entity.outerWidth() / 2,
                    };
                },
            };

            var getDivByClass = function($parent, className) {
                var $area = $parent.find('.' + className);
                if ($area.length === 0) {
                    $area = $('<div>').addClass(className);
                    $parent.append($area);
                }
                return $area;
            };

            // Make the display area for text, spans, denotations, relations.
            var displayArea = getDivByClass(editor, 'textae-editor__body');

            // Get the display area for denotations and relations.
            var getAnnotationArea = function() {
                return getDivByClass(displayArea, 'textae-editor__body__annotation-box');
            };

            // Two functions are provided used when 'Instance Centric Mode' and 'Term Centric Mode'.
            var createEmptyTypeDomElementFuncs = function() {
                // A Type element has an entity_pane elment that has a label and will have entities.
                var templateFunction = function(hideEntityPaneFunc, classOfEntityType, spanId, type) {
                    var typeId = idFactory.makeTypeId(spanId, type);
                    // The EntityPane will have entities.
                    var $entityPane = $('<div>')
                        .attr('id', 'P-' + typeId)
                        .addClass('textae-editor__entity-pane');

                    hideEntityPaneFunc.apply($entityPane);

                    // Label over the span.
                    var $typeLabel = $('<div>')
                        .addClass('textae-editor__type-label')
                        .text(type)
                        .css({
                            'background-color': model.entityTypes.getType(type).getColor(),
                        });

                    return $('<div>')
                        .attr('id', typeId)
                        .addClass(classOfEntityType)
                        .css({
                            'padding-top': CONSTS.TYPE_MARGIN_TOP,
                            'margin-bottom': CONSTS.TYPE_MARGIN_BOTTOM
                        })
                        .append($typeLabel)
                        .append($entityPane); //set pane after label because pane is over label.
                };

                return {
                    visible: templateFunction.bind(null, function() {
                        // Do not hide.
                    }, 'textae-editor__type'),
                    invisible: templateFunction.bind(null, function() {
                        this.hide();
                    }, 'textae-editor__type_term-centric-mode'),
                };
            }();

            // Set a default function for 'Instance Centric Mode'.
            var createEmptyTypeDomElement = createEmptyTypeDomElementFuncs.visible;

            return {
                helper: function() {
                    var originalRedrawFunction = function() {
                        renderer.grid.arrangePositionAll();
                        renderer.relation.arrangePositionAll();
                    };

                    return {
                        // Get the display area for text and spans.
                        getSourceDocArea: function() {
                            return getDivByClass(displayArea, 'textae-editor__body__text-box');
                        },
                        renderAnnotation: function() {
                            var setBodyOffset = function() {
                                //set body offset top half of line space between line of text-box.
                                var $area = renderer.helper.getSourceDocArea();
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
                                renderer.helper.getSourceDocArea().find('p').each(function(index, element) {
                                    var $element = $(element);
                                    var paragraph = $.extend(model.annotationData.paragraphsArray[index], {
                                        element: $element,
                                    });
                                    $element.attr('id', paragraph.id);

                                    paragraphs[paragraph.id] = paragraph;
                                });

                                return paragraphs;
                            };

                            //render an source document
                            setBodyOffset();
                            renderer.helper.getSourceDocArea().html(getTaggedSourceDoc());
                            renderer.paragraphs = makeParagraphs();

                            //render annotations
                            getAnnotationArea().empty();
                            renderer.helper.renderAllSpan();

                            // Render relations
                            renderer.helper.renderAllRelation();
                        },
                        renderAllSpan: function() {
                            // For tuning
                            // var startTime = new Date();

                            model.annotationData.spansTopLevel.forEach(function(span) {
                                renderer.span.render(span.id);
                            });

                            // For tuning
                            // var endTime = new Date();
                            // console.log('render all span : ', endTime.getTime() - startTime.getTime() + 'ms');
                        },
                        renderAllRelation: function() {
                            renderer.relation.reset();

                            model.annotationData.getRelationIds()
                                .forEach(function(relationId) {
                                    renderer.relation.render(relationId);
                                });
                        },
                        redraw: originalRedrawFunction,
                        switchViewMode: function() {
                            var showAllEntities = function() {
                                var originalMarginBottomOfGrid;
                                return function(isShow) {
                                    if (isShow) {
                                        editor.find('.textae-editor__entity-pane').show();
                                        editor.find('.textae-editor__type_term-centric-mode')
                                            .removeClass('textae-editor__type_term-centric-mode')
                                            .addClass('textae-editor__type');

                                        CONSTS.TYPE_MARGIN_BOTTOM = originalMarginBottomOfGrid;
                                    } else {
                                        editor.find('.textae-editor__entity-pane').hide();
                                        editor.find('.textae-editor__type')
                                            .removeClass('textae-editor__type')
                                            .addClass('textae-editor__type_term-centric-mode');

                                        // Override margin-bottom of gird.
                                        originalMarginBottomOfGrid = CONSTS.TYPE_MARGIN_BOTTOM;
                                        CONSTS.TYPE_MARGIN_BOTTOM = 0;
                                    }
                                };
                            }();

                            var showAllRelations = function(isShow) {
                                $.map(renderer.relation.cachedConnectors, function(connector) {
                                    return connector;
                                }).forEach(function(connector) {
                                    connector.endpoints.forEach(function(endpoint) {
                                        endpoint.setVisible(isShow);
                                    });
                                    connector.setVisible(isShow);
                                });
                            };

                            var addRelationsIntoTargetOfRedraw = function(isWhithRelation) {
                                if (isWhithRelation) {
                                    // Revert the redraw logic.
                                    renderer.helper.redraw = originalRedrawFunction;
                                } else {
                                    // Override the redraw logic to exclude relations from rendered.
                                    originalRedrawFunction = renderer.helper.redraw;
                                    renderer.helper.redraw = renderer.grid.arrangePositionAll;
                                }
                            };

                            var visualizeEntityTypeCreated = function(isVisible) {
                                if (isVisible) {
                                    createEmptyTypeDomElement = createEmptyTypeDomElementFuncs.visible;
                                } else {
                                    createEmptyTypeDomElement = createEmptyTypeDomElementFuncs.invisible;
                                }
                            };

                            return function(mode) {
                                if (mode === 'TERM') {
                                    showAllEntities(false);
                                    showAllRelations(false);
                                    addRelationsIntoTargetOfRedraw(false);
                                    visualizeEntityTypeCreated(false);
                                } else if (mode === 'INSTANCE') {
                                    showAllEntities(true);
                                    showAllRelations(true);
                                    addRelationsIntoTargetOfRedraw(true);
                                    visualizeEntityTypeCreated(true);
                                }
                            };
                        }(),
                        changeLineHeight: function(heightValue) {
                            editor.find('.textae-editor__body__text-box').css({
                                'line-height': heightValue * 100 + '%'
                            });
                        },
                    };
                }(),
                span: {
                    render: function(spanId) {
                        var renderSingleSpan = function(currentSpan) {
                            // Create the Range to a new span add 
                            var createRange = function(textNode, textNodeStartPosition) {
                                var startPos = currentSpan.begin - textNodeStartPosition;
                                var endPos = currentSpan.end - textNodeStartPosition;
                                if (startPos < 0 || textNode.length < endPos) {
                                    throw new Error('oh my god! I cannot render this span. ' + currentSpan.toStringOnlyThis() + ', textNode ' + textNode.textContent);
                                }

                                var range = document.createRange();
                                range.setStart(textNode, startPos);
                                range.setEnd(textNode, endPos);
                                return range;
                            };

                            // Get the Range to that new span tag insert.
                            // This function works well when no child span is rendered. 
                            var getRangeToInsertSpanTag = function(spanId) {
                                var createRangeForFirstSpanInParagraph = function(currentSpan) {
                                    var paragraph = renderer.paragraphs[currentSpan.paragraph.id];
                                    textNodeInParagraph = paragraph.element.contents().filter(function() {
                                        return this.nodeType === 3; //TEXT_NODE
                                    }).get(0);
                                    return createRange(textNodeInParagraph, paragraph.begin);
                                };

                                // The parent of the bigBrother is same with currentSpan, whitc is a span or the root of spanTree. 
                                var bigBrother = currentSpan.getBigBrother();
                                if (bigBrother) {
                                    // The target text arrounded by currentSpan is in a textNode after the bigBrother if bigBrother exists.
                                    return createRange(document.getElementById(bigBrother.id).nextSibling, bigBrother.end);
                                } else {
                                    // The target text arrounded by currentSpan is the first child of parent unless bigBrother exists.
                                    if (currentSpan.parent) {
                                        // The parent is span
                                        var textNodeInPrevSpan = domSelector.span.get(currentSpan.parent.id).contents().filter(function() {
                                            return this.nodeType === 3;
                                        }).get(0);
                                        return createRange(textNodeInPrevSpan, currentSpan.parent.begin);
                                    } else {
                                        // The parent is paragraph
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

                        var renderEntitiesOfSpan = function(span) {
                            span.getTypes().forEach(function(type) {
                                type.entities.forEach(function(entityId) {
                                    renderer.entity.render(model.annotationData.entities[entityId]);
                                });
                            });
                        };

                        var destroyChildrenSpan = function(currentSpan) {
                            // Destroy DOM elements of descendant spans.
                            var destroySpanRecurcive = function(span) {
                                span.children.forEach(function(span) {
                                    destroySpanRecurcive(span);
                                });
                                renderer.span.destroy(span.id);
                            };

                            // Destroy rendered children.
                            currentSpan.children.filter(function(childSpan) {
                                return document.getElementById(childSpan.id) !== null;
                            }).forEach(function(childSpan) {
                                destroySpanRecurcive(childSpan);
                            });
                        };

                        var currentSpan = model.annotationData.getSpan(spanId);

                        // Destroy children spans to wrap a TextNode with <span> tag when new span over exists spans.
                        destroyChildrenSpan(currentSpan);

                        renderSingleSpan(currentSpan);
                        renderEntitiesOfSpan(currentSpan);

                        // Render children spans.
                        currentSpan.children.filter(function(childSpan) {
                            return document.getElementById(childSpan.id) === null;
                        }).forEach(function(childSpan) {
                            renderer.span.render(childSpan.id);
                        });

                        renderer.grid.arrangePosition(currentSpan);
                    },
                    destroy: function(spanId) {
                        var spanElement = document.getElementById(spanId);
                        var parent = spanElement.parentNode;
                        while (spanElement.firstChild) {
                            parent.insertBefore(spanElement.firstChild, spanElement);
                        }
                        parent.removeChild(spanElement);
                        parent.normalize();

                        // Destroy a grid of the span. 
                        destroyGrid(spanId);
                    },
                },
                entity: function() {
                    var getTypeDom = function(spanId, type) {
                        return $('#' + idFactory.makeTypeId(spanId, type));
                    };

                    // Arrange a position of the pane to center entities when entities width is longer than pane width.
                    var arrangePositionOfPane = function(pane) {
                        var paneWidth = pane.outerWidth();
                        var entitiesWidth = pane.find('.textae-editor__entity').toArray().map(function(e) {
                            return e.offsetWidth;
                        }).reduce(function(pv, cv) {
                            return pv + cv;
                        }, 0);

                        pane.css({
                            'left': entitiesWidth > paneWidth ? (paneWidth - entitiesWidth) / 2 : 0
                        });
                    };

                    var removeEntityElement = function(entity) {
                        var doesTypeHasNoEntity = function(typeName) {
                            return model.annotationData.getSpan(entity.span).getTypes().filter(function(type) {
                                return type.name === typeName;
                            }).length === 0;
                        };

                        // An entity may have new type when changing type of the entity.
                        // DOM has old type.
                        var typeOnDom = domSelector.entity.get(entity.id).remove().attr('type');

                        // Delete type if no entity.
                        if (doesTypeHasNoEntity(typeOnDom)) {
                            getTypeDom(entity.span, typeOnDom).remove();
                        } else {
                            arrangePositionOfPane(getTypeDom(entity.span, typeOnDom).find('.textae-editor__entity-pane'));
                        }
                    };

                    return {
                        // An entity is a circle on Type that is an endpoint of a relation.
                        // A span have one grid and a grid can have multi types and a type can have multi entities.
                        // A grid is only shown when at least one entity is owned by a correspond span.  
                        render: function(entity) {
                            //render type unless exists.
                            var getTypeElement = function(spanId, type) {
                                var getGrid = function(spanId) {
                                    var createGrid = function(spanId) {
                                        var spanPosition = positionUtils.getSpan(spanId);
                                        var $grid = $('<div>')
                                            .attr('id', 'G' + spanId)
                                            .addClass('textae-editor__grid')
                                            .css({
                                                'width': spanPosition.width
                                            });

                                        //append to the annotation area.
                                        getAnnotationArea().append($grid);

                                        return $grid;
                                    };

                                    // Create a grid unless it exists.
                                    var $grid = domSelector.grid.get(spanId);
                                    if ($grid.length === 0) {
                                        return createGrid(spanId);
                                    } else {
                                        return $grid;
                                    }
                                };

                                var $type = getTypeDom(spanId, type);
                                if ($type.length === 0) {
                                    $type = createEmptyTypeDomElement(spanId, type);
                                    getGrid(spanId).append($type);
                                }

                                return $type;
                            };

                            var createEntityElement = function(entity) {
                                return $('<div>')
                                    .attr('id', idFactory.makeEntityDomId(entity.id))
                                    .attr('title', entity.id)
                                    .attr('type', String(entity.type)) // Replace null to 'null' if type is null. 
                                .addClass('textae-editor__entity')
                                    .css({
                                        'border-color': model.entityTypes.getType(entity.type).getColor()
                                    });
                            };

                            // Append a new entity to the type
                            var pane = getTypeElement(entity.span, entity.type)
                                .find('.textae-editor__entity-pane')
                                .append(createEntityElement(entity));

                            arrangePositionOfPane(pane);
                        },
                        destroy: function(entity) {
                            var doesSpanHasNoEntity = function(spanId) {
                                return model.annotationData.getSpan(spanId).getTypes().length === 0;
                            };

                            if (doesSpanHasNoEntity(entity.span)) {
                                // Destroy a grid when all entities are remove. 
                                destroyGrid(entity.span);
                            } else {
                                // Destroy an each entity.
                                removeEntityElement(entity);
                            }
                        },
                        changeTypeOfExists: function(entity) {
                            // Remove old entity.
                            removeEntityElement(entity);

                            // Show new enitty.
                            renderer.entity.render(entity);
                        },
                    };
                }(),
                grid: {
                    arrangePosition: function(span) {
                        var stickGridOnSpan = function(span) {
                            var spanId = span.id;
                            var spanPosition = positionUtils.getSpan(spanId);
                            var gridPosition = positionUtils.getGrid(spanId);
                            domSelector.grid.get(spanId).css({
                                'top': spanPosition.top - CONSTS.TYPE_MARGIN_BOTTOM - gridPosition.height,
                                'left': spanPosition.left
                            });
                        };

                        var pullUpGridOverDescendants = function(span) {
                            var getChildrenMaxHeight = function(span) {
                                return span.children.length === 0 ? 0 :
                                    Math.max.apply(null, span.children.map(function(childSpan) {
                                        return domSelector.span.get(childSpan.id).outerHeight();
                                    }));
                            };

                            // Culculate the height of the grid include descendant grids, because css style affects slowly.
                            var getHeightIncludeDescendantGrids = function(span) {
                                var descendantsMaxHeight = span.children.length === 0 ? 0 :
                                    Math.max.apply(null, span.children.map(function(childSpan) {
                                        return getHeightIncludeDescendantGrids(childSpan);
                                    }));

                                // console.log(span.id, 'childrenMaxHeight', descendantsMaxHeight);

                                // var ret = domSelector.grid.get(span.id).outerHeight() + descendantsMaxHeight + CONSTS.TYPE_MARGIN_BOTTOM;
                                var ret = positionUtils.getGrid(span.id).height + descendantsMaxHeight + CONSTS.TYPE_MARGIN_BOTTOM;

                                // console.log(span.id, 'descendantsMaxHeight', ret);

                                return ret;
                            };

                            if (span.getTypes().length > 0 && span.children.length > 0) {
                                var spanPosition = positionUtils.getSpan(span.id);
                                var descendantsMaxHeight = getHeightIncludeDescendantGrids(span);

                                domSelector.grid.get(span.id).css({
                                    'top': spanPosition.top - CONSTS.TYPE_MARGIN_BOTTOM - descendantsMaxHeight,
                                });
                                // console.log('pull', span.id, spanPosition.top, '-', CONSTS.TYPE_MARGIN_BOTTOM, '-', descendantsMaxHeight, '=', spanPosition.top - CONSTS.TYPE_MARGIN_BOTTOM - descendantsMaxHeight);
                            }
                        };

                        stickGridOnSpan(span);
                        pullUpGridOverDescendants(span);
                    },
                    arrangePositionAll: function() {
                        var arrangePositionGridAndoDescendant = function(span) {
                            // Arrange position All descendants because a grandchild maybe have types when a child has no type. 
                            span.children
                                .forEach(function(span) {
                                    arrangePositionGridAndoDescendant(span);
                                });
                            renderer.grid.arrangePosition(span);
                        };

                        model.annotationData.spansTopLevel
                            .filter(function(span) {
                                // There is at least one type in span that has a grid.
                                return span.getTypes().length > 0;
                            })
                            .forEach(function(span) {
                                arrangePositionGridAndoDescendant(span);
                            });
                    }
                },
                relation: function() {
                    // Init a jsPlumb instance.
                    var jsPlumbInstance = function() {
                        var newInstance = jsPlumb.getInstance({
                            ConnectionsDetachable: false,
                            Endpoint: ['Dot', {
                                radius: 1
                            }]
                        });
                        newInstance.setRenderMode(newInstance.SVG);
                        newInstance.Defaults.Container = getAnnotationArea();
                        return newInstance;
                    }();

                    var determineCurviness = function(sourceId, targetId) {
                        var sourcePosition = positionUtils.getEntity(sourceId);
                        var targetPosition = positionUtils.getEntity(targetId);

                        var sourceX = sourcePosition.center;
                        var targetX = targetPosition.center;

                        var sourceY = sourcePosition.top;
                        var targetY = targetPosition.top;

                        var xdiff = Math.abs(sourceX - targetX);
                        var ydiff = Math.abs(sourceY - targetY);
                        var curviness = xdiff * renderer.relation.settings.xrate + ydiff * renderer.relation.settings.yrate + renderer.relation.settings.c_offset;
                        curviness /= 2.4;

                        return curviness;
                    };

                    return {
                        // Parameters to render relations.
                        settings: {
                            // opacity of connectorsA
                            connOpacity: 0.6,

                            // curviness parameters
                            xrate: 0.6,
                            yrate: 0.05,

                            // curviness offset
                            c_offset: 20,
                        },
                        cachedConnectors: {},
                        reset: function() {
                            jsPlumbInstance.reset();
                            renderer.relation.cachedConnectors = {};
                            renderer.relation.relationIdsSelected = [];
                        },
                        render: function(relationId) {
                            var sourceId = model.annotationData.relations[relationId].subj;
                            var targetId = model.annotationData.relations[relationId].obj;

                            //  Determination of anchor points
                            var sourceAnchor, targetAnchor, curviness;
                            if (sourceId == targetId) {
                                // In case of self-reference
                                sourceAnchor = [0.5, 0, -1, -1];
                                targetAnchor = [0.5, 0, 1, -1];
                                curviness = 30;
                            } else {
                                sourceAnchor = 'TopCenter';
                                targetAnchor = 'TopCenter';
                                curviness = determineCurviness(sourceId, targetId);
                            }

                            // make connector
                            var pred = model.annotationData.relations[relationId].pred;
                            var conn = jsPlumbInstance.connect({
                                source: domSelector.entity.get(sourceId),
                                target: domSelector.entity.get(targetId),
                                anchors: [sourceAnchor, targetAnchor],
                                connector: ['Bezier', {
                                    curviness: curviness
                                }],
                                paintStyle: model.connectorTypes[pred].paintStyle,
                                hoverPaintStyle: model.connectorTypes[pred].hoverPaintStyle,
                                parameters: {
                                    'id': relationId,
                                },
                                cssClass: 'textae-editor__relation',
                                overlays: [
                                    ['Arrow', {
                                        width: 10,
                                        length: 12,
                                        location: 1
                                    }],
                                    ['Label', {
                                        label: '[' + relationId + '] ' + pred,
                                        cssClass: 'textae-editor__relation__label'
                                    }]
                                ],
                            });

                            // Notify to contoroller that a new jsPlumbConnection is added.
                            editor.trigger('textae.editor.jsPlumbConnection.add', conn);

                            // Cache a connector instance.
                            renderer.relation.cachedConnectors[relationId] = conn;
                        },
                        destroy: function(relationId) {
                            var c = renderer.relation.cachedConnectors[relationId];
                            jsPlumbInstance.detach(c);
                        },
                        arrangePosition: function(relationId) {
                            // recompute curviness
                            var sourceId = model.annotationData.relations[relationId].subj;
                            var targetId = model.annotationData.relations[relationId].obj;
                            var curviness = determineCurviness(sourceId, targetId);

                            if (sourceId == targetId) curviness = 30;

                            var conn = renderer.relation.cachedConnectors[relationId];
                            conn.endpoints[0].repaint();
                            conn.endpoints[1].repaint();
                            conn.setConnector(['Bezier', {
                                curviness: curviness
                            }]);
                            conn.addOverlay(['Arrow', {
                                width: 10,
                                length: 12,
                                location: 1
                            }]);
                        },
                        arrangePositionAll: function() {
                            model.annotationData.getRelationIds()
                                .forEach(function(relationId) {
                                    renderer.relation.arrangePosition(relationId);
                                });
                        },
                        isRelationSelected: function(relationId) {
                            return (renderer.relation.relationIdsSelected.indexOf(relationId) > -1);
                        },
                        selectRelation: function(relationId) {
                            if (!renderer.relation.isRelationSelected(relationId)) {
                                renderer.relation.cachedConnectors[relationId].setPaintStyle(model.connectorTypes[model.annotationData.relations[relationId].pred + "_selected"].paintStyle);
                                renderer.relation.relationIdsSelected.push(relationId);
                            }
                        },
                        deselectRelation: function(relationId) {
                            var i = renderer.relation.relationIdsSelected.indexOf(relationId);
                            if (i > -1) {
                                renderer.relation.cachedConnectors[relationId].setPaintStyle(model.connectorTypes[model.annotationData.relations[relationId].pred].paintStyle);
                                renderer.relation.relationIdsSelected.splice(i, 1);
                            }
                        },
                        clearRelationSelection: function() {
                            while (renderer.relation.relationIdsSelected.length > 0) {
                                var relationId = renderer.relation.relationIdsSelected.pop();
                                renderer.relation.cachedConnectors[relationId].setPaintStyle(model.connectorTypes[model.annotationData.relations[relationId].pred].paintStyle);
                            }
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
                    var $parent = $(node).parent();
                    var parentId = $parent.attr("id");

                    var pos;
                    if ($parent.hasClass("textae-editor__body__text-box__paragraph")) {
                        pos = renderer.paragraphs[parentId].begin;
                    } else if ($parent.hasClass("textae-editor__span")) {
                        pos = model.annotationData.getSpan(parentId).begin;
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
                    return [command.factory.spanMoveCommand(spanId, begin, end)];
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
                        commands = moveSpan(sid, newBegin, model.annotationData.getSpan(sid).end);
                    } else {
                        // expand to the right
                        var newEnd = adjustSpanEnd(focusPosition);
                        commands = moveSpan(sid, model.annotationData.getSpan(sid).begin, newEnd);
                    }

                    command.invoke(commands);
                };

                var shortenSpan = function(sid, selection) {
                    var commands = [];

                    var focusPosition = getFocusPosition(selection);

                    var range = selection.getRangeAt(0);
                    var focusRange = document.createRange();
                    focusRange.selectNode(selection.focusNode);

                    var removeSpan = function(spanId) {
                        return [command.factory.spanRemoveCommand(spanId)];
                    };

                    var new_sid, tid, eid, type;
                    if (range.compareBoundaryPoints(Range.START_TO_START, focusRange) > 0) {
                        // shorten the right boundary
                        var newEnd = adjustSpanEnd2(focusPosition);

                        if (newEnd > model.annotationData.getSpan(sid).begin) {
                            new_sid = idFactory.makeSpanId(model.annotationData.getSpan(sid).begin, newEnd);
                            if (model.annotationData.getSpan(new_sid)) {
                                commands = removeSpan(sid);
                            } else {
                                commands = moveSpan(sid, model.annotationData.getSpan(sid).begin, newEnd);
                            }
                        } else {
                            domSelector.span.select(sid);
                            businessLogic.removeSelectedElements();
                        }
                    } else {
                        // shorten the left boundary
                        var newBegin = adjustSpanBegin2(focusPosition);

                        if (newBegin < model.annotationData.getSpan(sid).end) {
                            new_sid = idFactory.makeSpanId(newBegin, model.annotationData.getSpan(sid).end);
                            if (model.annotationData.getSpan(new_sid)) {
                                commands = removeSpan(sid);
                            } else {
                                commands = moveSpan(sid, newBegin, model.annotationData.getSpan(sid).end);
                            }
                        } else {
                            domSelector.span.select(sid);
                            businessLogic.removeSelectedElements();
                        }
                    }

                    command.invoke(commands);
                };

                var selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                    var range = selection.getRangeAt(0);

                    if (
                        // when the whole div is selected by e.g., triple click
                        (range.startContainer == renderer.helper.getSourceDocArea().get(0)) ||
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

                        if (!model.annotationData.getSpan(sid)) {
                            if (endPosition - beginPosition > CONSTS.BLOCK_THRESHOLD) {
                                command.invoke([command.factory.spanCreateCommand({
                                    begin: beginPosition,
                                    end: endPosition
                                })]);
                            } else {
                                var commands = [command.factory.spanCreateCommand({
                                    begin: beginPosition,
                                    end: endPosition
                                })];

                                if (editorState.isReplicateAuto) {
                                    var replicates = command.factory.spanReplicateCommand({
                                        begin: beginPosition,
                                        end: endPosition
                                    });
                                    commands.push(replicates);
                                }
                                command.invoke(commands);
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
                            if ((anchorPosition > model.annotationData.getSpan(sid).begin) && (anchorPosition < model.annotationData.getSpan(sid).end)) {
                                // The focus node should be at one level above the selected node.
                                if (domSelector.span.get(sid).get(0).parentNode.id == selection.focusNode.parentNode.id) expandSpan(sid, selection);
                                else {
                                    domSelector.span.select(sid);
                                    alert('A span cannot be expanded to make a boundary crossing.');
                                }
                            }

                            // drag ended inside the selected span (shortening)
                            else if ((focusPosition > model.annotationData.getSpan(sid).begin) && (focusPosition < model.annotationData.getSpan(sid).end)) {
                                if (domSelector.span.get(sid).get(0).id == selection.focusNode.parentNode.id) shortenSpan(sid, selection);
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

            // A relation is drawn by a jsPlumbConnection.
            var jsPlumbConnectionClicked = function(jsPlumbConnection, event) {
                var relationId = jsPlumbConnection.getParameter("id");

                domSelector.unselect();

                if (renderer.relation.isRelationSelected(relationId)) {
                    renderer.relation.deselectRelation(relationId);
                } else {
                    if (!event.ctrlKey) {
                        renderer.relation.clearRelationSelection();
                    }
                    renderer.relation.selectRelation(relationId);
                }

                cancelBubble(event);
                return false;
            };

            var editorSelected = function() {
                editor.tool.selectMe();
                editorState.buttonState.renderEnable();
            };

            return {
                // Bind user input event to handler
                init: function() {
                    editor
                        .on('mouseup', '.textae-editor__body', bodyClicked)
                        .on('mouseup', '.textae-editor__span', spanClicked)
                        .on('mouseup', '.textae-editor__entity', entityClicked)
                        .on('mouseup', '.textae-editor__body,.textae-editor__span,.textae-editor__grid,.textae-editor__entity', editorSelected);

                    // The jsPlumbConnetion has an original event mecanism.
                    // We can only bind the connection directory.
                    editor
                        .on('textae.editor.jsPlumbConnection.add', function(event, jsPlumbConnection) {
                            jsPlumbConnection.bind('click', jsPlumbConnectionClicked);
                        });
                }
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
                renderer.relation.clearRelationSelection();
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
                        renderer.relation.clearRelationSelection();
                        select(target);
                    }
                };
            }(),
            span: {
                get: function(spanId) {
                    return $('#' + spanId);
                },
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
                select: function(spanId) {
                    domSelector.span.get(spanId).addClass('ui-selected');
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
            grid: {
                get: function(spanId) {
                    return $('#G' + spanId);
                }
            },
        };

        //user event to edit model
        var businessLogic = {
            loadAnnotation: function(annotation) {
                var parseSouseDoc = function(data) {
                    //validate
                    if (data.text === undefined) {
                        alert("read failed.");
                        return;
                    }

                    //parse a souce document.
                    model.sourceDoc = data.text;
                    model.annotationData.parseParagraphs(data.text);
                };

                var parseDenotations = function(data) {
                    model.annotationData.parseDenotations(data.denotations);
                    if (data.denotations !== undefined) {
                        data.denotations.forEach(function(d) {
                            //d.obj is type of entity.
                            model.entityTypes.incrementNumberOfTypes(d.obj);
                        });
                    }
                };

                var parseRelations = function(data) {
                    model.annotationData.parseRelations(data.relations);
                    model.initRelationsPerEntity(data.relations);
                    model.initConnectorTypes();
                };

                model.annotationData.reset();
                parseSouseDoc(annotation);
                parseDenotations(annotation);
                parseRelations(annotation);
                command.resetHistory();

                renderer.helper.renderAnnotation();
            },
            saveHistory: function() {
                command.updateSavePoint();
            },

            replicate: function() {
                if (domSelector.span.getNumberOfSelected() === 1) {
                    command.invoke([command.factory.spanReplicateCommand(model.annotationData.getSpan(domSelector.span.getSelectedId()))]);
                } else {
                    alert('You can replicate span annotation when there is only span selected.');
                }
            },

            createEntity: function() {
                var commands = [];
                domSelector.span.getSelecteds().each(function() {
                    commands.push(command.factory.entityCreateCommand(this.id, model.entityTypes.getDefaultType()));
                });

                command.invoke(commands);
            },

            changeTypeOfSelectedEntities: function(newType) {
                var $selectedEntities = domSelector.entity.getSelecteds();
                if ($selectedEntities.length > 0) {

                    var commands = [];
                    $selectedEntities.each(function() {
                        commands.push(command.factory.entityChangeTypeCommand(this.title, newType));
                    });

                    command.invoke(commands);
                }
            },
            // set the type of an entity
            setEntityType: function() {
                var newType = $(this).attr('label');
                businessLogic.changeTypeOfSelectedEntities(newType);
                return false;
            },
            newLabel: function() {
                var newType = prompt("Please enter a new label", "");
                businessLogic.changeTypeOfSelectedEntities(newType);
            },

            removeSelectedElements: function() {
                var removeCommand = function() {
                    var unique = function(array) {
                        var hash = {};
                        array.forEach(function(element) {
                            hash[element] = null;
                        });
                        return Object.keys(hash);
                    };

                    var spanIds = [],
                        entityIds = [],
                        relationIds = [];
                    return {
                        addSpanId: function(spanId) {
                            spanIds.push(spanId);
                        },
                        addEntityId: function(entityId) {
                            entityIds.push(entityId);
                        },
                        addRelations: function(addedRelations) {
                            Array.prototype.push.apply(relationIds, addedRelations);
                        },
                        getAll: function() {
                            return unique(relationIds).map(command.factory.relationRemoveCommand)
                                .concat(
                                    unique(entityIds).map(function(entity) {
                                        // Wrap by a anonymous function, because command.factory.entityRemoveCommand has two optional argumets.
                                        return command.factory.entityRemoveCommand(entity);
                                    }),
                                    unique(spanIds).map(command.factory.spanRemoveCommand));
                        },
                    };
                }();

                var removeEnitity = function(entityId) {
                    removeCommand.addEntityId(entityId);
                    if (relationsPerEntity[entityId]) {
                        removeCommand.addRelations(relationsPerEntity[entityId]);
                    }
                };

                //remove spans
                domSelector.span.getSelecteds().each(function() {
                    var spanId = this.id;
                    removeCommand.addSpanId(spanId);

                    model.annotationData.getSpan(spanId).getTypes().forEach(function(type) {
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
                removeCommand.addRelations(renderer.relation.relationIdsSelected);
                renderer.relation.relationIdsSelected = [];

                command.invoke(removeCommand.getAll());
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
                    var spanId = this.id;
                    //clipBoard has entity ids.
                    commands = commands.concat(clipBoard.map(function(e) {
                        return command.factory.entityCreateCommand(spanId, model.annotationData.entities[e].type);
                    }));
                });

                command.invoke(commands);
            },

            // set the default type of denoting object
            setEntityTypeDefault: function() {
                model.entityTypes.setDefaultType($(this).attr('label'));
                return false;
            },
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

                    return textAeUtil.getDialog(self.editorId, 'textae.dialog.load', 'Load document with annotation.', $content);
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

                    return textAeUtil.getDialog(self.editorId, 'textae.dialog.save', 'Save document with annotation.', $content);
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
                command.updateSavePoint();
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
                    renderer.helper.redraw();
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
                        var span = model.annotationData.getSpan(domSelector.span.popSelectedId());
                        domSelector.unselect();
                        if (span.left) {
                            domSelector.span.select(span.left.id);
                        }
                    }
                },
                selectRightSpan: function() {
                    if (domSelector.span.getNumberOfSelected() == 1) {

                        var span = model.annotationData.getSpan(domSelector.span.popSelectedId());
                        domSelector.unselect();
                        if (span.right) {
                            domSelector.span.select(span.right.id);
                        }
                    }
                },
                showSettingDialog: function() {
                    var $content = $('<div>')
                        .addClass('textae-editor__setting-dialog');

                    // Line Height
                    $content
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
                            presentationLogic.changeLineHeight(value);
                        });

                    // Term Centric View
                    $content
                        .append($('<div>')
                            .append('<label>Term Centric View:')
                            .append($('<input>')
                                .attr({
                                    'type': 'checkbox'
                                })
                                .addClass('textae-editor__setting-dialog__term-centric-view')
                            ))
                        .on('click', '.textae-editor__setting-dialog__term-centric-view', function() {
                            var value = $(this).is(':checked');
                            presentationLogic.switchTermCentricView(value);
                        });

                    // Open the dialog.                        
                    textAeUtil.getDialog(self.editorId, 'textae.dialog.setting', 'Chage Settings', $content, true).open();
                },
                changeLineHeight: function(heightValue) {
                    renderer.helper.changeLineHeight(heightValue);
                    renderer.helper.redraw();
                },
                switchTermCentricView: function(isActive) {
                    if (isActive) {
                        renderer.helper.switchViewMode('TERM');
                    } else {
                        renderer.helper.switchViewMode('INSTANCE');
                    }
                    renderer.helper.redraw();
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
                    'X': command.redo,
                    'Y': command.redo,
                    'Z': command.undo,
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
                    'textae.control.button.undo.click': command.undo,
                    'textae.control.button.redo.click': command.redo,
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