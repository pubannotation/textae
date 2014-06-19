    var editor = function() {
        // constant values
        var CONSTS = {
            BLOCK_THRESHOLD: 100
        };

        var idFactory = makeIdFactory(this);

        // model manages data objects.
        var model = makeModel(idFactory);

        var view = function(editor) {
            // The cachedConnectors has jsPlumbConnectors to call jsPlumbConnector instance to edit an according dom object.
            // This is refered by view.render.relation and view.domUtil.selector.relation.
            var cachedConnectors = {};
            var toConnector = function(relationId) {
                return cachedConnectors[relationId];
            };

            // Data for view.
            var viewModel = function() {
                var createTypeContainer = function(getActualTypesFunction, defaultColor) {
                    var definedTypes = {},
                        defaultType = 'something';

                    return {
                        setDefinedTypes: function(newDefinedTypes) {
                            definedTypes = newDefinedTypes;
                        },
                        setDefaultType: function(name) {
                            defaultType = name;
                        },
                        getDefaultType: function() {
                            return defaultType || this.getSortedNames()[0];
                        },
                        getColor: function(name) {
                            return definedTypes[name] && definedTypes[name].color || defaultColor;
                        },
                        getUri: function(name) {
                            return definedTypes[name] && definedTypes[name].uri || undefined;
                        },
                        getSortedNames: function() {
                            if (getActualTypesFunction) {
                                var typeCount = getActualTypesFunction()
                                    .concat(Object.keys(definedTypes))
                                    .reduce(function(a, b) {
                                        a[b] = a[b] ? a[b] + 1 : 1;
                                        return a;
                                    }, {});

                                // Sort by number of types, and by name if numbers are same.
                                var typeNames = Object.keys(typeCount);
                                typeNames.sort(function(a, b) {
                                    var diff = typeCount[b] - typeCount[a];
                                    return diff !== 0 ? diff :
                                        a > b ? 1 :
                                        b < a ? -1 :
                                        0;
                                });

                                return typeNames;
                            } else {
                                return [];
                            }
                        }
                    };
                };

                var setContainerDefinedTypes = function(container, newDefinedTypes) {
                    // expected newDefinedTypes is an array of object. example of object is {"name": "Regulation","color": "#FFFF66","default": true}.
                    if (newDefinedTypes !== undefined) {
                        container.setDefinedTypes(
                            newDefinedTypes.map(function(type) {
                                return type;
                            }).reduce(function(a, b) {
                                a[b.name] = b;
                                return a;
                            }, {})
                        );

                        container.setDefaultType(
                            newDefinedTypes.filter(function(type) {
                                return type["default"] === true;
                            }).map(function(type) {
                                return type.name;
                            }).shift() || ''
                        );
                    }
                };

                var entityContainer = createTypeContainer(model.annotationData.entity.types, '#77DDDD');
                var relationContaier = createTypeContainer(model.annotationData.relation.types, '#555555');

                return {
                    // view.viewModel.clipBoard has entity id only.
                    clipBoard: [],
                    // Modes accoding to buttons of control.
                    modeAccordingToButton: function() {
                        var makeButton = function(buttonName) {
                            // Button state is true when the button is pushed.
                            var state = false,
                                value = function(newValue) {
                                    if (newValue !== undefined) {
                                        state = newValue;
                                        propagate();
                                    } else {
                                        return state;
                                    }
                                },
                                toggle = function toggleButton() {
                                    state = !state;
                                    propagate();
                                },
                                // Propagate button state to the tool.
                                propagate = function() {
                                    editor.tool.push(buttonName, state);
                                };

                            return {
                                name: buttonName,
                                value: value,
                                toggle: toggle,
                                propagate: propagate
                            };
                        };

                        // The public object.
                        var ret = ['replicate-auto', 'relation-edit-mode']
                            .map(makeButton)
                            .reduce(function(container, button) {
                                container[button.name] = button;
                                return container;
                            }, {});

                        return _.extend(ret, {
                            // Propagete states of all buttons.
                            propagate: function() {
                                _.each(this, function(button) {
                                    if (button.propagate) button.propagate();
                                });
                            }
                        });
                    }(),
                    // Helper to update button state. 
                    buttonStateHelper: function() {
                        var isEntityOrRelationSelected = function() {
                            return model.selectionModel.entity.some() || model.selectionModel.relation.some();
                        };
                        var disableButtons = {};
                        var updateDisableButtons = function(button, enable) {
                            if (enable) {
                                delete disableButtons[button];
                            } else {
                                disableButtons[button] = false;
                            }
                        };
                        var updateEntity = function() {
                            updateDisableButtons("entity", model.selectionModel.span.some());
                        };
                        var updatePaste = function() {
                            updateDisableButtons("paste", view.viewModel.clipBoard.length > 0 && model.selectionModel.span.some());
                        };
                        var updateReplicate = function() {
                            updateDisableButtons("replicate", model.selectionModel.span.single());
                        };
                        var updatePallet = function() {
                            updateDisableButtons("pallet", isEntityOrRelationSelected());
                        };
                        var updateNewLabel = function() {
                            updateDisableButtons("change-label", isEntityOrRelationSelected());
                        };
                        var updateDelete = function() {
                            // It works well on relation-edit-mode if relations are deselect brefore an entity is select.
                            updateDisableButtons("delete", model.selectionModel.some());
                        };
                        var updateCopy = function() {
                            updateDisableButtons("copy", model.selectionModel.span.some() || model.selectionModel.entity.some());
                        };
                        var updateBySpanAndEntityBoth = function() {
                            updateDelete();
                            updateCopy();
                        };
                        var propagate = function() {
                            editor.tool.changeButtonState(editor, disableButtons);
                            view.viewModel.modeAccordingToButton.propagate();
                        };
                        return {
                            propagate: propagate,
                            init: function() {
                                updateBySpanAndEntityBoth();

                                updateEntity();
                                updatePaste();
                                updateReplicate();
                                updatePallet();
                                updateNewLabel();

                                propagate();
                            },
                            enabled: function(button, enable) {
                                updateDisableButtons(button, enable);
                                propagate();
                            },
                            updateBySpan: function() {
                                updateBySpanAndEntityBoth();

                                updateEntity();
                                updatePaste();
                                updateReplicate();

                                propagate();
                            },
                            updateByEntity: function() {
                                updateBySpanAndEntityBoth();

                                updatePallet();
                                updateNewLabel();

                                propagate();
                            },
                            updateByRelation: function() {
                                updateDelete();
                                updatePallet();
                                updateNewLabel();

                                propagate();
                            }
                        };
                    }(),
                    viewMode: function() {
                        var changeCssClass = function(mode) {
                                editor
                                    .removeClass('textae-editor_term-mode')
                                    .removeClass('textae-editor_instance-mode')
                                    .removeClass('textae-editor_relation-mode')
                                    .addClass('textae-editor_' + mode + '-mode');
                            },
                            setRelationEditButtonPushed = function(push) {
                                view.viewModel.modeAccordingToButton['relation-edit-mode'].value(push);
                            },
                            // Select the typeLabel if all entities is selected.
                            entitySelectChanged = function(entityId) {
                                var $entity = domUtil.selector.entity.get(entityId),
                                    $typePane = $entity.parent(),
                                    $typeLabel = $typePane.prev();

                                if ($typePane.children().length === $typePane.find('.ui-selected').length) {
                                    selectionClass.addClass($typeLabel);
                                } else {
                                    selectionClass.removeClass($typeLabel);
                                }

                                // This notify is off at relation-edit-mode.
                                view.viewModel.buttonStateHelper.updateByEntity();
                            };

                        return {
                            // This is base value to calculate the position of grids.
                            // Grids cannot be set positon by 'margin-bottom' style.
                            // Because grids is setted 'positin:absolute' style in the overlay over spans.
                            // So we caluclate and set 'top' of grids in functions of 'view.renderer.helper.redraw'. 
                            marginBottomOfGrid: 0,
                            isTerm: function() {
                                return editor.hasClass('textae-editor_term-mode');
                            },
                            setTerm: function() {
                                changeCssClass('term');
                                setRelationEditButtonPushed(false);

                                view.viewModel.viewMode.marginBottomOfGrid = 0;
                                view.renderer.helper.redraw();

                                model.selectionModel
                                    .unbind('entity.select', entitySelectChanged)
                                    .unbind('entity.deselect', entitySelectChanged)
                                    .unbind('entity.change', entitySelectChanged)
                                    .bind('entity.select', entitySelectChanged)
                                    .bind('entity.deselect', entitySelectChanged)
                                    .bind('entity.change', viewModel.buttonStateHelper.updateByEntity);

                            },
                            setInstance: function() {
                                changeCssClass('instance');
                                setRelationEditButtonPushed(false);

                                view.viewModel.viewMode.marginBottomOfGrid = 2;
                                view.renderer.helper.redraw();

                                model.selectionModel
                                    .unbind('entity.select', entitySelectChanged)
                                    .unbind('entity.deselect', entitySelectChanged)
                                    .unbind('entity.change', viewModel.buttonStateHelper.updateByEntity)
                                    .bind('entity.select', entitySelectChanged)
                                    .bind('entity.deselect', entitySelectChanged)
                                    .bind('entity.change', viewModel.buttonStateHelper.updateByEntity);
                            },
                            setRelation: function() {
                                changeCssClass('relation');
                                setRelationEditButtonPushed(true);

                                view.viewModel.viewMode.marginBottomOfGrid = 2;
                                view.renderer.helper.redraw();

                                model.selectionModel
                                    .unbind('entity.select', entitySelectChanged)
                                    .unbind('entity.deselect', entitySelectChanged)
                                    .unbind('entity.change', viewModel.buttonStateHelper.updateByEntity);
                            }
                        };
                    }(),
                    typeContainer: {
                        entity: entityContainer,
                        setDefinedEntityTypes: _.partial(setContainerDefinedTypes, entityContainer),
                        relation: relationContaier,
                        setDefinedRelationTypes: _.partial(setContainerDefinedTypes, relationContaier)
                    },
                    getConnectorStrokeStyle: function(relationId) {
                        var converseHEXinotRGBA = function(color, opacity) {
                            var c = color.slice(1);
                            r = parseInt(c.substr(0, 2), 16);
                            g = parseInt(c.substr(2, 2), 16);
                            b = parseInt(c.substr(4, 2), 16);

                            return 'rgba(' + r + ', ' + g + ', ' + b + ', 1)';
                        };

                        // TODO configにrelationの設定がなくて、annotationにrelationがひとつも無いときにはcolorHexが取得できないため、relationが作れない。
                        // そもそもそのような状況を想定すべきか謎。何かしらの・・・configは必須ではないか？
                        var pred = model.annotationData.relation.get(relationId).pred;
                        var colorHex = view.viewModel.typeContainer.relation.getColor(pred);

                        return {
                            lineWidth: 1,
                            strokeStyle: converseHEXinotRGBA(colorHex, 1)
                        };
                    }
                };
            }();

            // Render DOM elements conforming with the Model.
            var renderer = function() {
                // The Reference to model. This set by init.
                var model;

                // The cache for span positions.
                // Getting the postion of spans is too slow about 5-10 ms per a element in Chrome browser. For example offsetTop property.
                // This cache is big effective for the initiation, and little effective for resize. 
                var positionCache = {};

                var useCache = function(prefix, getPositionFunciton, spanId) {
                    var chacheId = prefix + spanId;
                    return positionCache[chacheId] ? positionCache[chacheId] : positionCache[chacheId] = getPositionFunciton(spanId);
                };

                // The posion of the text-box to calculate span postion; 
                var textOffset;

                // Utility functions for get positions of elemnts.
                var positionUtils = {
                    reset: function() {
                        positionCache = {};
                        textOffset = editor.find('.textae-editor__body__text-box').offset();
                    },
                    getSpan: _.partial(useCache, 'S', function(spanId) {
                        var $span = view.domUtil.selector.span.get(spanId);
                        if ($span.length === 0) {
                            throw new Error("span is not renderd : " + spanId);
                        }

                        var offset = $span.offset();
                        return {
                            top: offset.top - textOffset.top,
                            left: offset.left - textOffset.left,
                            width: $span.outerWidth(),
                            height: $span.outerHeight(),
                            center: $span.get(0).offsetLeft + $span.outerWidth() / 2
                        };
                    }),
                    getGrid: _.partial(useCache, 'G', function(spanId) {
                        return view.domUtil.selector.grid.get(spanId).offset();
                    }),
                    getEntity: function(entityId) {
                        var spanId = model.annotationData.entity.get(entityId).span;

                        var $entity = view.domUtil.selector.entity.get(entityId);
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

                var getElement = function($parent, tagName, className) {
                    var $area = $parent.find('.' + className);
                    if ($area.length === 0) {
                        $area = $('<' + tagName + '>').addClass(className);
                        $parent.append($area);
                    }
                    return $area;
                };

                // Make the display area for text, spans, denotations, relations.
                var displayArea = _.partial(getElement, editor, 'div', 'textae-editor__body');

                // Get the display area for denotations and relations.
                var getAnnotationArea = function() {
                    return getElement(displayArea(), 'div', 'textae-editor__body__annotation-box');
                };

                var renderSourceDocument = function(params) {
                    // Get the display area for text and spans.
                    var getSourceDocArea = function() {
                            return getElement(displayArea(), 'div', 'textae-editor__body__text-box');
                        },

                        // the Souce document has multi paragraphs that are splited by '\n'.
                        getTaggedSourceDoc = function(sourceDoc) {
                            //set sroucedoc tagged <p> per line.
                            return sourceDoc.split("\n").map(function(par) {
                                return '<p class="textae-editor__body__text-box__paragraph-margin"><span class="textae-editor__body__text-box__paragraph">' + par + '</span></p>';
                            }).join("\n");
                        },

                        // Paragraphs is Object that has position of charactor at start and end of the statement in each paragraph.
                        makeParagraphs = function(paragraphsArray) {
                            var paragraphs = {};

                            //enchant id to paragraph element and chache it.
                            getSourceDocArea().find('.textae-editor__body__text-box__paragraph').each(function(index, element) {
                                var $element = $(element);
                                var paragraph = $.extend({}, paragraphsArray[index], {
                                    element: $element,
                                });
                                $element.attr('id', paragraph.id);

                                paragraphs[paragraph.id] = paragraph;
                            });

                            return paragraphs;
                        };

                    // Render the source document
                    getSourceDocArea().html(getTaggedSourceDoc(params.sourceDoc));
                    view.renderer.paragraphs = makeParagraphs(params.paragraphs);
                };

                var reset = function(annotationData) {
                    var renderAllSpan = function(annotationData) {
                            // For tuning
                            // var startTime = new Date();

                            annotationData.span.topLevel().forEach(function(span) {
                                renderer.span.render(span);
                            });

                            // For tuning
                            // var endTime = new Date();
                            // console.log('render all span : ', endTime.getTime() - startTime.getTime() + 'ms');
                        },
                        renderAllRelation = function(annotationData) {
                            renderer.relation.reset();

                            annotationData.relation.all().forEach(function(relation) {
                                _.defer(_.partial(renderer.relation.render, relation));
                            });
                        };

                    // Render annotations
                    getAnnotationArea().empty();
                    positionUtils.reset();
                    renderer.grid.reset();
                    renderAllSpan(annotationData);

                    // Render relations
                    renderAllRelation(annotationData);
                };

                var renderer = function() {
                    var removeDom = function(target) {
                            return target.remove();
                        },
                        destroyGrid = function(spanId) {
                            removeDom(view.domUtil.selector.grid.get(spanId));
                            gridRenderer.destroy(spanId);
                        },
                        gridRenderer = function() {
                            var gridPositionCache = {};

                            var createGrid = function(container, spanId) {
                                    var spanPosition = positionUtils.getSpan(spanId);
                                    var $grid = $('<div>')
                                        .attr('id', 'G' + spanId)
                                        .addClass('textae-editor__grid')
                                        .addClass('hidden')
                                        .css({
                                            'width': spanPosition.width
                                        });

                                    //append to the annotation area.
                                    container.append($grid);

                                    return $grid;
                                },
                                init = function(container) {
                                    createGrid = _.partial(createGrid, container);
                                };

                            var filterChanged = function(span, newPosition) {
                                var oldGridPosition = gridPositionCache[span.id];
                                if (!oldGridPosition || oldGridPosition.top !== newPosition.top || oldGridPosition.left !== newPosition.left) {
                                    return newPosition;
                                } else {
                                    return undefined;
                                }
                            };

                            var arrangeRelationPosition = function(span) {
                                _.compact(
                                    _.flatten(
                                        span.getEntities().map(model.annotationData.entity.assosicatedRelations)
                                    )
                                    .map(toConnector)
                                ).forEach(function(connector) {
                                    connector.arrangePosition();
                                });
                            };

                            var getGrid = function(span) {
                                if (span) {
                                    return view.domUtil.selector.grid.get(span.id);
                                }
                            };

                            var updateGridPositon = function(span, newPosition) {
                                if (newPosition) {
                                    getGrid(span).css(newPosition);
                                    gridPositionCache[span.id] = newPosition;
                                    arrangeRelationPosition(span);
                                    return span;
                                }
                            };

                            var getNewPosition = function(span) {
                                var stickGridOnSpan = function(span) {
                                    var spanPosition = positionUtils.getSpan(span.id);

                                    return {
                                        'top': spanPosition.top - view.viewModel.viewMode.marginBottomOfGrid - getGrid(span).outerHeight(),
                                        'left': spanPosition.left
                                    };
                                };

                                var pullUpGridOverDescendants = function(span) {
                                    // Culculate the height of the grid include descendant grids, because css style affects slowly.
                                    var getHeightIncludeDescendantGrids = function(span) {
                                        var descendantsMaxHeight = span.children.length === 0 ? 0 :
                                            Math.max.apply(null, span.children.map(function(childSpan) {
                                                return getHeightIncludeDescendantGrids(childSpan);
                                            }));

                                        return getGrid(span).outerHeight() + descendantsMaxHeight + view.viewModel.viewMode.marginBottomOfGrid;
                                    };

                                    var spanPosition = positionUtils.getSpan(span.id);
                                    var descendantsMaxHeight = getHeightIncludeDescendantGrids(span);

                                    return {
                                        'top': spanPosition.top - view.viewModel.viewMode.marginBottomOfGrid - descendantsMaxHeight,
                                        'left': spanPosition.left
                                    };
                                };

                                if (span.children.length === 0) {
                                    return stickGridOnSpan(span);
                                } else {
                                    return pullUpGridOverDescendants(span);
                                }
                            };

                            var filterVisibleGrid = function(grid) {
                                if (grid && grid.hasClass('hidden')) {
                                    return grid;
                                }
                            };

                            var visibleGrid = function(grid) {
                                if (grid) {
                                    grid.removeClass('hidden');
                                }
                            };

                            var arrangeGridPosition = function(span) {
                                var moveTheGridIfChange = _.compose(_.partial(updateGridPositon, span), _.partial(filterChanged, span));
                                _.compose(visibleGrid, filterVisibleGrid, getGrid, moveTheGridIfChange, getNewPosition)(span);
                            };

                            var arrangePositionGridAndoDescendant = function(span) {
                                // Arrange position All descendants because a grandchild maybe have types when a child has no type. 
                                span.children
                                    .forEach(function(span) {
                                        arrangePositionGridAndoDescendant(span);
                                    });

                                // There is at least one type in span that has a grid.
                                if (span.getTypes().length > 0) {
                                    arrangeGridPosition(span);
                                }
                            };

                            var arrangePositionAll = function() {
                                positionUtils.reset();
                                model.annotationData.span.topLevel()
                                    .forEach(function(span) {
                                        _.defer(_.partial(arrangePositionGridAndoDescendant, span));
                                    });
                            };

                            return {
                                init: init,
                                reset: function() {
                                    gridPositionCache = {};
                                },
                                render: function(spanId) {
                                    return createGrid(spanId);
                                },
                                arrangePositionAll: _.debounce(arrangePositionAll, 10),
                                destroy: function(spanId) {
                                    delete gridPositionCache[spanId];
                                }
                            };
                        }(),
                        spanRenderer = function() {
                            // Get the Range to that new span tag insert.
                            // This function works well when no child span is rendered. 
                            var getRangeToInsertSpanTag = function(span) {
                                var getPosition = function(span, textNodeStartPosition) {
                                    var startPos = span.begin - textNodeStartPosition;
                                    var endPos = span.end - textNodeStartPosition;
                                    return {
                                        start: startPos,
                                        end: endPos
                                    };
                                };

                                var validatePosition = function(position, textNode, span) {
                                    if (position.start < 0 || textNode.length < position.end) {
                                        throw new Error('oh my god! I cannot render this span. ' + span.toStringOnlyThis() + ', textNode ' + textNode.textContent);
                                    }
                                };

                                var createRange = function(textNode, position) {
                                    var range = document.createRange();
                                    range.setStart(textNode, position.start);
                                    range.setEnd(textNode, position.end);
                                    return range;
                                };

                                // Create the Range to a new span add 
                                var createSpanRange = function(span, textNodeStartPosition, textNode) {
                                    var position = getPosition(span, textNodeStartPosition);
                                    validatePosition(position, textNode, span);

                                    return createRange(textNode, position);
                                };

                                var isTextNode = function() {
                                    return this.nodeType === 3; //TEXT_NODE
                                };

                                var getFirstTextNode = function($element) {
                                    return $element.contents().filter(isTextNode).get(0);
                                };

                                var getParagraphElement = function(paragraphId) {
                                    // A jQuery object of paragrapsh is cached.
                                    return view.renderer.paragraphs[paragraphId].element;
                                };

                                var createRangeForFirstSpan = function(getJqueryObjectFunc, span, textaeRange) {
                                    var getTextNode = _.compose(getFirstTextNode, getJqueryObjectFunc);
                                    var textNode = getTextNode(textaeRange.id);
                                    return createSpanRange(span, textaeRange.begin, textNode);
                                };

                                var createRangeForFirstSpanInParent = _.partial(createRangeForFirstSpan, view.domUtil.selector.span.get);
                                var createRangeForFirstSpanInParagraph = _.partial(createRangeForFirstSpan, getParagraphElement);

                                // The parent of the bigBrother is same with span, which is a span or the root of spanTree. 
                                var bigBrother = span.getBigBrother();
                                if (bigBrother) {
                                    // The target text arrounded by span is in a textNode after the bigBrother if bigBrother exists.
                                    return createSpanRange(span, bigBrother.end, document.getElementById(bigBrother.id).nextSibling);
                                } else {
                                    // The target text arrounded by span is the first child of parent unless bigBrother exists.
                                    if (span.parent) {
                                        // The parent is span.
                                        // This span is first child of span.
                                        return createRangeForFirstSpanInParent(span, span.parent);
                                    } else {
                                        // The parent is paragraph
                                        return createRangeForFirstSpanInParagraph(span, span.paragraph);
                                    }
                                }
                            };

                            var appendSpanElement = function(span, element) {
                                getRangeToInsertSpanTag(span).surroundContents(element);

                                return span;
                            };

                            var createSpanElement = function(span) {
                                var element = document.createElement('span');
                                element.setAttribute('id', span.id);
                                element.setAttribute('title', span.id);
                                element.setAttribute('class', 'textae-editor__span');
                                return element;
                            };

                            var renderSingleSpan = function(span) {
                                return appendSpanElement(span, createSpanElement(span));
                            };

                            var renderEntitiesOfType = function(type) {
                                type.entities.forEach(_.compose(entityRenderer.render, model.annotationData.entity.get));
                            };

                            var renderEntitiesOfSpan = function(span) {
                                span.getTypes().forEach(renderEntitiesOfType);
                                return span;
                            };

                            var exists = function(span) {
                                return document.getElementById(span.id) !== null;
                            };

                            var not = function(value) {
                                return !value;
                            };

                            var destroy = function(span) {
                                var spanElement = document.getElementById(span.id);
                                var parent = spanElement.parentNode;

                                // Move the textNode wrapped this span in front of this span.
                                while (spanElement.firstChild) {
                                    parent.insertBefore(spanElement.firstChild, spanElement);
                                }

                                removeDom($(spanElement));
                                parent.normalize();

                                // Destroy a grid of the span. 
                                destroyGrid(span.id);
                            };

                            var destroyChildrenSpan = function(span) {
                                // Destroy DOM elements of descendant spans.
                                var destroySpanRecurcive = function(span) {
                                    span.children.forEach(function(span) {
                                        destroySpanRecurcive(span);
                                    });
                                    destroy(span);
                                };

                                // Destroy rendered children.
                                span.children.filter(exists).forEach(destroySpanRecurcive);

                                return span;
                            };

                            var renderChildresnSpan = function(span) {
                                span.children.filter(_.compose(not, exists))
                                    .forEach(create);

                                return span;
                            };

                            // Destroy children spans to wrap a TextNode with <span> tag when new span over exists spans.
                            var create = _.compose(renderChildresnSpan, renderEntitiesOfSpan, renderSingleSpan, destroyChildrenSpan);

                            var andMoveGrid = _.partial(_.compose, gridRenderer.arrangePositionAll);

                            return {
                                render: andMoveGrid(create),
                                remove: andMoveGrid(destroy)
                            };
                        }(),
                        entityRenderer = function() {
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

                            var doesSpanHasNoEntity = function(spanId) {
                                return model.annotationData.span.get(spanId).getTypes().length === 0;
                            };

                            var removeEntityElement = function(entity) {
                                var doesTypeHasNoEntity = function(typeName) {
                                    return model.annotationData.span.get(entity.span).getTypes().filter(function(type) {
                                        return type.name === typeName;
                                    }).length === 0;
                                };

                                // Get old type from Dom, Because the entity may have new type when changing type of the entity.
                                var oldType = removeDom(view.domUtil.selector.entity.get(entity.id)).attr('type');

                                // Delete type if no entity.
                                if (doesTypeHasNoEntity(oldType)) {
                                    getTypeDom(entity.span, oldType).remove();
                                } else {
                                    // Arrage the position of TypePane, because number of entities decrease.
                                    arrangePositionOfPane(getTypeDom(entity.span, oldType).find('.textae-editor__entity-pane'));
                                }
                            };

                            var changeTypeOfExists = function(entity) {
                                // Remove old entity.
                                removeEntityElement(entity);

                                // Show new entity.
                                create(entity);
                            };

                            // An entity is a circle on Type that is an endpoint of a relation.
                            // A span have one grid and a grid can have multi types and a type can have multi entities.
                            // A grid is only shown when at least one entity is owned by a correspond span.  
                            var create = function(entity) {
                                //render type unless exists.
                                var getTypeElement = function(spanId, type) {
                                    // A Type element has an entity_pane elment that has a label and will have entities.
                                    var createEmptyTypeDomElement = function(spanId, type) {
                                        var typeId = idFactory.makeTypeId(spanId, type);
                                        // The EntityPane will have entities.
                                        var $entityPane = $('<div>')
                                            .attr('id', 'P-' + typeId)
                                            .addClass('textae-editor__entity-pane');

                                        // Display short name for URL(http or https);
                                        var displayName = type;
                                        // For tunning, search the scheme before execute a regular-expression.
                                        if (String(type).indexOf('http') > -1) {
                                            // The regular-expression to parse URL.
                                            // See detail:
                                            // http://someweblog.com/url-regular-expression-javascript-link-shortener/
                                            var urlRegex = /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/gi;
                                            var matches = urlRegex.exec(type);
                                            // Order to dispaly.
                                            // 1. The file name with the extention.
                                            // 2. The last directory name.
                                            // 3. The domain name.
                                            displayName = matches[6] ? matches[6] + (matches[7] || '') :
                                                matches[5] ? matches[5].split('/').filter(function(s) {
                                                    return s !== '';
                                                }).pop() :
                                                matches[3];
                                        }

                                        // The label over the span.
                                        var $typeLabel = $('<div>')
                                            .addClass('textae-editor__type-label')
                                            .text(displayName)
                                            .css({
                                                'background-color': view.viewModel.typeContainer.entity.getColor(type),
                                            });

                                        return $('<div>')
                                            .attr('id', typeId)
                                            .addClass('textae-editor__type')
                                            .append($typeLabel)
                                            .append($entityPane); // Set pane after label because pane is over label.
                                    };

                                    var getGrid = function(spanId) {
                                        // Create a grid unless it exists.
                                        var $grid = view.domUtil.selector.grid.get(spanId);
                                        if ($grid.length === 0) {
                                            return gridRenderer.render(spanId);
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
                                    var $entity = $('<div>')
                                        .attr('id', idFactory.makeEntityDomId(entity.id))
                                        .attr('title', entity.id)
                                        .attr('type', entity.type)
                                        .addClass('textae-editor__entity')
                                        .css({
                                            'border-color': view.viewModel.typeContainer.entity.getColor(entity.type)
                                        });

                                    // Set css classes for modifications.
                                    model.annotationData.modification.all().filter(function(m) {
                                        return m.obj === entity.id;
                                    }).map(function(m) {
                                        return 'textae-editor__entity-' + m.pred.toLowerCase();
                                    }).forEach(function(className) {
                                        $entity.addClass(className);
                                    });

                                    return $entity;
                                };

                                // Replace null to 'null' if type is null and undefined too.
                                entity.type = String(entity.type);

                                // Append a new entity to the type
                                var pane = getTypeElement(entity.span, entity.type)
                                    .find('.textae-editor__entity-pane')
                                    .append(createEntityElement(entity));

                                arrangePositionOfPane(pane);
                            };

                            var destroy = function(entity) {
                                if (doesSpanHasNoEntity(entity.span)) {
                                    // Destroy a grid when all entities are remove. 
                                    destroyGrid(entity.span);
                                } else {
                                    // Destroy an each entity.
                                    removeEntityElement(entity);
                                }
                            };

                            return {
                                render: create,
                                change: changeTypeOfExists,
                                remove: destroy
                            };
                        }(),
                        relationRenderer = function() {
                            // Init a jsPlumb instance.
                            var jsPlumbInstance,
                                makeJsPlumbInstance = function(container) {
                                    var newInstance = jsPlumb.getInstance({
                                        ConnectionsDetachable: false,
                                        Endpoint: ['Dot', {
                                            radius: 1
                                        }]
                                    });
                                    newInstance.setRenderMode(newInstance.SVG);
                                    newInstance.Defaults.Container = container;
                                    return newInstance;
                                },
                                init = function(container) {
                                    jsPlumbInstance = makeJsPlumbInstance(container);
                                };

                            var determineCurviness = function(relationId) {
                                var sourceId = model.annotationData.relation.get(relationId).subj;
                                var targetId = model.annotationData.relation.get(relationId).obj;

                                var sourcePosition = positionUtils.getEntity(sourceId);
                                var targetPosition = positionUtils.getEntity(targetId);

                                var sourceX = sourcePosition.center;
                                var targetX = targetPosition.center;

                                var sourceY = sourcePosition.top;
                                var targetY = targetPosition.top;

                                var xdiff = Math.abs(sourceX - targetX);
                                var ydiff = Math.abs(sourceY - targetY);
                                var curviness = xdiff * relationRenderer.settings.xrate + ydiff * relationRenderer.settings.yrate + relationRenderer.settings.c_offset;
                                curviness /= 2.4;

                                return curviness;
                            };

                            // Overlay styles for jsPlubm connections.
                            var normalArrow = {
                                    width: 7,
                                    length: 9,
                                    location: 1,
                                    id: 'normal-arrow'
                                },
                                hoverArrow = {
                                    width: 14,
                                    length: 18,
                                    location: 1,
                                    id: 'hover-arrow',
                                },
                                label = {
                                    cssClass: 'textae-editor__relation__label',
                                    id: 'label'
                                };

                            var arrangePosition = function(relationId) {
                                var connect = toConnector(relationId);
                                connect.endpoints[0].repaint();
                                connect.endpoints[1].repaint();

                                // Re-set arrow disappered when setConnector is called.
                                connect.removeOverlay('normal-arrow');
                                connect.setConnector(['Bezier', {
                                    curviness: determineCurviness(relationId)
                                }]);
                                connect.addOverlay(['Arrow', normalArrow]);
                            };

                            var pointupable = function(getStrokeStyle) {
                                // Show a big arrow when the connect is hoverd.
                                // Remove a normal arrow and add a new big arrow.
                                // Because an arrow is out of position if hideOverlay and showOverlay is used.
                                var pointupArrow = function(connect) {
                                        connect.removeOverlay(normalArrow.id);
                                        connect.addOverlay(['Arrow', hoverArrow]);
                                        connect.setPaintStyle(_.extend(getStrokeStyle(), {
                                            lineWidth: 3
                                        }));
                                    },
                                    pointdownAllow = function(connect) {
                                        connect.removeOverlay(hoverArrow.id);
                                        connect.addOverlay(['Arrow', normalArrow]);
                                        connect.setPaintStyle(_.extend(getStrokeStyle(), {
                                            lineWidth: 1
                                        }));
                                    },
                                    pointupLable = function(connect) {
                                        connect.getOverlay(label.id).addClass('hover');

                                    },
                                    pointdownLabel = function(connect) {
                                        connect.getOverlay(label.id).removeClass('hover');
                                    };

                                return {
                                    pointup: function() {
                                        pointupArrow(this);
                                        pointupLable(this);
                                    },
                                    pointdown: function() {
                                        if (this.hasClass('ui-selected')) return;

                                        pointdownAllow(this);
                                        pointdownLabel(this);
                                    }
                                };
                            };

                            // Extend jsPlumb.Connection to add a method 'hasClass'.
                            var hasClass = {
                                hasClass: function(className) {
                                    return this.connector.canvas.classList.contains(className);
                                }
                            };

                            var createJsPlumbConnection = function(relation) {
                                var getStrokeStyle = _.partial(view.viewModel.getConnectorStrokeStyle, relation.id);

                                // Make a connector by jsPlumb.
                                var connect = jsPlumbInstance.connect({
                                    source: view.domUtil.selector.entity.get(relation.subj),
                                    target: view.domUtil.selector.entity.get(relation.obj),
                                    anchors: ['TopCenter', "TopCenter"],
                                    connector: ['Bezier', {
                                        curviness: determineCurviness(relation.id)
                                    }],
                                    paintStyle: getStrokeStyle(),
                                    parameters: {
                                        'id': relation.id,
                                    },
                                    cssClass: 'textae-editor__relation',
                                    overlays: [
                                        ['Arrow', normalArrow],
                                        ['Label', _.extend(label, {
                                            label: '[' + relation.id + '] ' + relation.pred
                                        })]
                                    ]
                                });

                                // Set a function debounce to avoid over rendering.
                                connect.arrangePosition = _.debounce(_.partial(arrangePosition, relation.id), 20);

                                // Extend
                                _.extend(connect, pointupable(getStrokeStyle), hasClass);

                                // Set hover action.
                                connect.bind('mouseenter', function(connect) {
                                    connect.pointup();
                                }).bind('mouseexit', function(connect) {
                                    connect.pointdown();
                                });

                                // Cache a connect instance.
                                cachedConnectors[relation.id] = connect;

                                // Notify to controller that a new jsPlumbConnection is added.
                                editor.trigger('textae.editor.jsPlumbConnection.add', connect);

                                return connect;
                            };

                            var changeJsPlubmOverlay = function(relation) {
                                var connector = toConnector(relation.id);
                                if (!connector) {
                                    throw 'no connector';
                                }

                                // Find the label overlay by self, because the function 'getLabelOverlays' returns no label overlay.
                                var labelOverlay = connector.getOverlays().filter(function(overlay) {
                                    return overlay.type === 'Label';
                                })[0];
                                if (!labelOverlay) {
                                    throw 'no label overlay';
                                }

                                labelOverlay.setLabel('[' + relation.id + '] ' + relation.pred);
                                connector.setPaintStyle(view.viewModel.getConnectorStrokeStyle(relation.id));
                            };

                            var removeJsPlumbConnection = function(relation) {
                                jsPlumbInstance.detach(toConnector(relation.id));
                                delete cachedConnectors[relation.id];
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
                                init: init,
                                reset: function() {
                                    jsPlumbInstance.reset();
                                    cachedConnectors = {};
                                },
                                render: createJsPlumbConnection,
                                change: changeJsPlubmOverlay,
                                remove: removeJsPlumbConnection
                            };
                        }();

                    return {
                        init: function(container) {
                            gridRenderer.init(container);
                            relationRenderer.init(container);
                        },
                        span: spanRenderer,
                        entity: entityRenderer,
                        grid: gridRenderer,
                        relation: relationRenderer
                    };
                }();

                var modelToId = function(modelElement) {
                    return modelElement.id;
                };

                var setSelectionModelHandler = function() {
                    var spanSelected = function(spanId) {
                            var $span = view.domUtil.selector.span.get(spanId);
                            selectionClass.addClass($span);
                        },
                        spanDeselected = function(spanId) {
                            var $span = view.domUtil.selector.span.get(spanId);
                            selectionClass.removeClass($span);
                        },
                        entitySelected = function(entityId) {
                            var $entity = view.domUtil.selector.entity.get(entityId);
                            selectionClass.addClass($entity);
                        },
                        entityDeselected = function(entityId) {
                            var $entity = view.domUtil.selector.entity.get(entityId);
                            selectionClass.removeClass($entity);
                        },
                        relationSelected = function(relationId) {
                            var addUiSelectClass = function(connector) {
                                    if (!connector) return;

                                    connector.addClass('ui-selected');
                                    connector.pointup();
                                },
                                selectRelation = _.compose(addUiSelectClass, toConnector);

                            selectRelation(relationId);
                        },
                        relationDeselected = function(relationId) {
                            var removeUiSelectClass = function(connector) {
                                    if (!connector) return;

                                    connector.removeClass('ui-selected');
                                    connector.pointdown();
                                },
                                deselectRelation = _.compose(removeUiSelectClass, toConnector);

                            deselectRelation(relationId);
                        };

                    // The viewModel.buttonStateHelper.updateByEntity is set at viewMode.
                    // Because entity.change is off at relation-edit-mode.
                    model.selectionModel
                        .bind('span.select', spanSelected)
                        .bind('span.deselect', spanDeselected)
                        .bind('span.change', viewModel.buttonStateHelper.updateBySpan)
                        .bind('entity.select', entitySelected)
                        .bind('entity.deselect', entityDeselected)
                        .bind('relation.select', relationSelected)
                        .bind('relation.deselect', relationDeselected)
                        .bind('relation.change', viewModel.buttonStateHelper.updateByRelation);
                };

                return {
                    init: function(modelData) {
                        renderer.init(getAnnotationArea());

                        model = modelData;
                        model.annotationData
                            .bind('change-text', renderSourceDocument)
                            .bind('all.change', _.compose(model.selectionModel.clear, reset))
                            .bind('span.add', renderer.span.render)
                            .bind('span.remove', renderer.span.remove)
                            .bind('span.remove', _.compose(model.selectionModel.span.remove, modelToId))
                            .bind('entity.add', _.compose(renderer.grid.arrangePositionAll, renderer.entity.render))
                            .bind('entity.change', _.compose(renderer.grid.arrangePositionAll, renderer.entity.change))
                            .bind('entity.remove', _.compose(renderer.grid.arrangePositionAll, renderer.entity.remove))
                            .bind('entity.remove', _.compose(model.selectionModel.entity.remove, modelToId))
                            .bind('relation.add', renderer.relation.render)
                            .bind('relation.change', renderer.relation.change)
                            .bind('relation.remove', renderer.relation.remove)
                            .bind('relation.remove', _.compose(model.selectionModel.relation.remove, modelToId));

                        setSelectionModelHandler();
                    },
                    helper: function() {
                        return {
                            changeLineHeight: function(heightValue) {
                                editor.find('.textae-editor__body__text-box').css({
                                    'line-height': heightValue + 'px',
                                    'margin-top': heightValue / 2 + 'px'
                                });
                            },
                            getLineHeight: function() {
                                return parseInt(editor.find('.textae-editor__body__text-box').css('line-height')) / 16;
                            },
                            changeTypeGap: function(typeGapValue) {
                                editor.find('.textae-editor__type').css({
                                    height: 18 * typeGapValue + 18 + 'px',
                                    'padding-top': 18 * typeGapValue + 'px'
                                });
                                renderer.grid.arrangePositionAll();
                            },
                            redraw: renderer.grid.arrangePositionAll
                        };
                    }()
                };
            }();

            // Add or Remove class to indicate selected state.
            var selectionClass = function() {
                var addClass = function($target) {
                        return $target.addClass('ui-selected');
                    },
                    removeClass = function($target) {
                        return $target.removeClass('ui-selected');
                    };

                return {
                    addClass: addClass,
                    removeClass: removeClass
                };
            }();

            var domUtil = {
                selector: {
                    span: {
                        get: function(spanId) {
                            return editor.find('#' + spanId);
                        }
                    },
                    entity: {
                        get: function(entityId) {
                            return $('#' + idFactory.makeEntityDomId(entityId));
                        }
                    },
                    grid: {
                        get: function(spanId) {
                            return editor.find('#G' + spanId);
                        }
                    },
                },
                manipulate: {
                    dismissBrowserSelection: function() {
                        var selection = window.getSelection();
                        selection.collapse(document.body, 0);
                    }
                },
                hover: function() {
                    var processAccosiatedRelation = function(func, entityId) {
                        model.annotationData.entity.assosicatedRelations(entityId)
                            .map(toConnector)
                            .forEach(func);
                    };

                    return {
                        on: _.partial(processAccosiatedRelation, function(connector) {
                            connector.pointup();
                        }),
                        off: _.partial(processAccosiatedRelation, function(connector) {
                            connector.pointdown();
                        })
                    };
                }()
            };

            return {
                init: function() {
                    view.viewModel.buttonStateHelper.init();
                    view.renderer.init(model);
                },
                renderer: renderer,
                domUtil: domUtil,
                viewModel: viewModel
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

            var getPosition = function(node) {
                var $parent = $(node).parent();
                var parentId = $parent.attr("id");

                var pos;
                if ($parent.hasClass("textae-editor__body__text-box__paragraph")) {
                    pos = view.renderer.paragraphs[parentId].begin;
                } else if ($parent.hasClass("textae-editor__span")) {
                    pos = model.annotationData.span.get(parentId).begin;
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
                while (controller.spanConfig.isNonEdgeCharacter(model.annotationData.sourceDoc.charAt(pos))) {
                    pos++;
                }
                while (!controller.spanConfig.isDelimiter(model.annotationData.sourceDoc.charAt(pos)) && pos > 0 && !controller.spanConfig.isDelimiter(model.annotationData.sourceDoc.charAt(pos - 1))) {
                    pos--;
                }
                return pos;
            };

            // adjust the end position of a span
            var adjustSpanEnd = function(endPosition) {
                var pos = endPosition;
                while (controller.spanConfig.isNonEdgeCharacter(model.annotationData.sourceDoc.charAt(pos - 1))) {
                    pos--;
                }
                while (!controller.spanConfig.isDelimiter(model.annotationData.sourceDoc.charAt(pos)) && pos < model.annotationData.sourceDoc.length) {
                    pos++;
                }
                return pos;
            };

            // adjust the beginning position of a span for shortening
            var adjustSpanBegin2 = function(beginPosition) {
                var pos = beginPosition;
                while ((pos < model.annotationData.sourceDoc.length) && (controller.spanConfig.isNonEdgeCharacter(model.annotationData.sourceDoc.charAt(pos)) || !controller.spanConfig.isDelimiter(model.annotationData.sourceDoc.charAt(pos - 1)))) {
                    pos++;
                }
                return pos;
            };

            // adjust the end position of a span for shortening
            var adjustSpanEnd2 = function(endPosition) {
                var pos = endPosition;
                while ((pos > 0) && (controller.spanConfig.isNonEdgeCharacter(model.annotationData.sourceDoc.charAt(pos - 1)) || !controller.spanConfig.isDelimiter(model.annotationData.sourceDoc.charAt(pos)))) {
                    pos--;
                }
                return pos;
            };

            var createSpanIfOneParent = function(selection) {
                // A span can be created at the same parent node.
                // The parentElement is expected as a paragraph or a span.
                if (selection.anchorNode.parentElement.id !== selection.focusNode.parentElement.id) {
                    console.log(selection.anchorNode.parentElement.id, selection.focusNode.parentElement.id);
                    return false;
                }

                var anchorPosition = getAnchorPosition(selection);
                var focusPosition = getFocusPosition(selection);

                // switch the position when the selection is made from right to left
                if (anchorPosition > focusPosition) {
                    var tmpPos = anchorPosition;
                    anchorPosition = focusPosition;
                    focusPosition = tmpPos;
                }

                // A span cannot be created include nonEdgeCharacters only.
                var stringWithoutNonEdgeCharacters = model.annotationData.sourceDoc.substring(anchorPosition, focusPosition);
                controller.spanConfig.nonEdgeCharacters.forEach(function(char) {
                    stringWithoutNonEdgeCharacters = stringWithoutNonEdgeCharacters.replace(char, '');
                });
                if (stringWithoutNonEdgeCharacters.length === 0) {
                    view.domUtil.manipulate.dismissBrowserSelection();
                    // Return true to return from the caller function.
                    return true;
                }

                model.selectionModel.clear();
                (function doCreate(beginPosition, endPosition) {
                    var spanId = idFactory.makeSpanId(beginPosition, endPosition);

                    // The span exists already.
                    if (model.annotationData.span.get(spanId)) {
                        return;
                    }

                    var commands = [command.factory.spanCreateCommand({
                        begin: beginPosition,
                        end: endPosition
                    })];

                    if (view.viewModel.modeAccordingToButton['replicate-auto'].value() && endPosition - beginPosition <= CONSTS.BLOCK_THRESHOLD) {
                        commands.push(command.factory.spanReplicateCommand({
                            begin: beginPosition,
                            end: endPosition
                        }));
                    }

                    command.invoke(commands);

                })(adjustSpanBegin(anchorPosition), adjustSpanEnd(focusPosition));

                return true;
            };

            var moveSpan = function(spanId, begin, end) {
                // Do not need move.
                if (spanId === idFactory.makeSpanId(begin, end)) {
                    return;
                }

                return [command.factory.spanMoveCommand(spanId, begin, end)];
            };

            var expandSpan = function(spanId, selection) {
                var commands = [];

                var focusPosition = getFocusPosition(selection);

                var range = selection.getRangeAt(0);
                var anchorRange = document.createRange();
                anchorRange.selectNode(selection.anchorNode);

                if (range.compareBoundaryPoints(Range.START_TO_START, anchorRange) < 0) {
                    // expand to the left
                    var newBegin = adjustSpanBegin(focusPosition);
                    commands = moveSpan(spanId, newBegin, model.annotationData.span.get(spanId).end);
                } else {
                    // expand to the right
                    var newEnd = adjustSpanEnd(focusPosition);
                    commands = moveSpan(spanId, model.annotationData.span.get(spanId).begin, newEnd);
                }

                command.invoke(commands);
            };

            var shortenSpan = function(spanId, selection) {
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

                    if (newEnd > model.annotationData.span.get(spanId).begin) {
                        new_sid = idFactory.makeSpanId(model.annotationData.span.get(spanId).begin, newEnd);
                        if (model.annotationData.span.get(new_sid)) {
                            commands = removeSpan(spanId);
                        } else {
                            commands = moveSpan(spanId, model.annotationData.span.get(spanId).begin, newEnd);
                        }
                    } else {
                        model.selectionModel.span.add(spanId);
                        controller.userEvent.editHandler.removeSelectedElements();
                    }
                } else {
                    // shorten the left boundary
                    var newBegin = adjustSpanBegin2(focusPosition);

                    if (newBegin < model.annotationData.span.get(spanId).end) {
                        new_sid = idFactory.makeSpanId(newBegin, model.annotationData.span.get(spanId).end);
                        if (model.annotationData.span.get(new_sid)) {
                            commands = removeSpan(spanId);
                        } else {
                            commands = moveSpan(spanId, newBegin, model.annotationData.span.get(spanId).end);
                        }
                    } else {
                        model.selectionModel.span.add(spanId);
                        controller.userEvent.editHandler.removeSelectedElements();
                    }
                }

                command.invoke(commands);
            };

            var isInSelectedSpan = function(position) {
                var spanId = model.selectionModel.span.single();
                if (spanId) {
                    var selectedSpan = model.annotationData.span.get(spanId);
                    return selectedSpan.begin < position && position < selectedSpan.end;
                }
                return false;
            };

            var expandIfable = function(selection) {
                if (selection.anchorNode.parentNode.parentNode === selection.focusNode.parentNode) {
                    // To expand the span , belows are needed:
                    // 1. The anchorNode is in the span.
                    // 2. The foucusNode is out of the span and in the parent of the span.
                    model.selectionModel.clear();
                    expandSpan(selection.anchorNode.parentNode.id, selection);

                    view.domUtil.manipulate.dismissBrowserSelection();
                    return true;
                }

                // If a span is selected, it is able to begin drag a span in the span and expand the span.
                if (isInSelectedSpan(getAnchorPosition(selection))) {
                    var selectedSpanId = model.selectionModel.span.all()[0];

                    // The focus node should be at one level above the selected node.
                    if (view.domUtil.selector.span.get(selectedSpanId).parent().attr('id') === selection.focusNode.parentNode.id) {
                        // cf.
                        // 1. Select an outside span.
                        // 2. Begin Drug from an inner span to out of an outside span. 
                        // Expand the selected span.
                        expandSpan(selectedSpanId, selection);
                        view.domUtil.manipulate.dismissBrowserSelection();
                        return true;
                    } else {
                        // cf.
                        // 1. Select an inner span.
                        // 2. Begin Drug from an inner span to out of an outside span. 
                        // To expand the selected span is disable.
                        alert('A span cannot be expanded to make a boundary crossing.');
                        view.domUtil.manipulate.dismissBrowserSelection();
                        return true;
                    }
                }

                // To expand a span is disable.
                return false;
            };

            var shrinkIfable = function(selection) {
                if (selection.anchorNode.parentNode === selection.focusNode.parentNode.parentNode) {
                    // To shrink the span , belows are needed:
                    // 1. The anchorNode out of the span and in the parent of the span.
                    // 2. The foucusNode is in the span.
                    model.selectionModel.clear();
                    shortenSpan(selection.focusNode.parentNode.id, selection);
                    view.domUtil.manipulate.dismissBrowserSelection();
                    return true;
                }

                // If a span is selected, it is able to begin drag out of an outer span of the span and shrink the span.
                if (isInSelectedSpan(getFocusPosition(selection))) {
                    var selectedSpanId = model.selectionModel.span.all()[0];

                    // The focus node should be at the selected node.
                    if (selection.focusNode.parentNode.id === selectedSpanId) {
                        // cf.
                        // 1. Select an inner span.
                        // 2. Begin Drug from out of an outside span to the selected span. 
                        // Shrink the selected span.
                        shortenSpan(selectedSpanId, selection);
                        view.domUtil.manipulate.dismissBrowserSelection();
                        return true;
                    } else {
                        // cf.
                        // 1. Select an outside span.
                        // 2. Begin Drug from out of an outside span to an inner span. 
                        // To shrink the selected span is disable.
                        alert('A span cannot be shrinked to make a boundary crossing.');
                        view.domUtil.manipulate.dismissBrowserSelection();
                        return true;
                    }
                }

                // To shrink a span is disable.
                return false;
            };

            var overParagraph = function() {
                alert('It is ambiguous for which span you want to adjust the boundary. Select the span, and try again.');
                view.domUtil.manipulate.dismissBrowserSelection();
            };

            var selectEndOfText = function(selection) {
                // The Both node is not TextNode( nodeType == 3 ) either.
                // This occurs by triple-clicks of a text.
                if (selection.anchorNode.nodeType !== 3 || selection.focusNode.nodeType !== 3) {
                    // Blinking occurs if dissmiss here.
                    // Return true and the browser dissmiss the selection. 
                    return true;
                }

                if (createSpanIfOneParent(selection)) {
                    return false;
                }

                if (expandIfable(selection)) {
                    return false;
                }

                overParagraph();
                return false;
            };

            var selectEndOnSpan = function(selection) {
                // The Both node is not TextNode( nodeType == 3 ) either.
                // This occurs by triple-clicks of a span.
                if (selection.anchorNode.nodeType !== 3 || selection.focusNode.nodeType !== 3) {
                    // Blinking occurs if dissmiss here.
                    // Return true and the browser dissmiss the selection. 
                    return true;
                }

                if (createSpanIfOneParent(selection)) {
                    return false;
                }

                if (expandIfable(selection)) {
                    return false;
                }

                if (shrinkIfable(selection)) {
                    return false;
                }

                overParagraph();
                return false;
            };

            var bodyClicked = function(e) {
                var selection = window.getSelection();

                // No select
                if (selection.isCollapsed) {
                    controller.userEvent.viewHandler.cancelSelect();
                    view.domUtil.manipulate.dismissBrowserSelection();

                    return true;
                }

                return selectEndOfText(selection);
            };

            var spanClicked = function(e) {
                var selection = window.getSelection();

                // No select
                if (selection.isCollapsed) {
                    var firstId = model.selectionModel.span.single();
                    if (e.shiftKey && firstId) {
                        //select reange of spans.
                        var secondId = $(this).attr('id');

                        model.selectionModel.clear();

                        model.annotationData.span.range(firstId, secondId)
                            .forEach(function(spanId) {
                                model.selectionModel.span.add(spanId);
                            });
                    } else if (e.ctrlKey || e.metaKey) {
                        model.selectionModel.span.toggle(e.target.id);
                    } else {
                        model.selectionModel.clear();
                        model.selectionModel.span.add(e.target.id);
                    }

                    return false;
                }

                return selectEndOnSpan(selection);
            };

            var labelOrPaneClicked = function(ctrlKey, $typeLabel, $entities) {
                var selectEntities = function($entities) {
                        $entities.each(function() {
                            model.selectionModel.entity.add($(this).attr('title'));
                        });
                    },
                    deselectEntities = function($entities) {
                        $entities.each(function() {
                            model.selectionModel.entity.remove($(this).attr('title'));
                        });
                    };

                if (ctrlKey) {
                    if ($typeLabel.hasClass('ui-selected')) {
                        deselectEntities($entities);
                    } else {
                        selectEntities($entities);
                    }
                } else {
                    model.selectionModel.clear();
                    selectEntities($entities);
                }
                return false;
            };

            var typeLabelClicked = function(e) {
                var $typeLabel = $(e.target);
                return labelOrPaneClicked(e.ctrlKey || e.metaKey, $typeLabel, $typeLabel.next().children());
            };

            var entityPaneClicked = function(e) {
                var $typePane = $(e.target);
                return labelOrPaneClicked(e.ctrlKey || e.metaKey, $typePane.prev(), $typePane.children());
            };

            // Select or deselect relation.
            // This function is expected to be called when Relation-Edit-Mode.
            var selectRelation = function(jsPlumbConnection, event) {
                var relationId = jsPlumbConnection.getParameter("id");

                if (event.ctrlKey || event.metaKey) {
                    model.selectionModel.relation.toggle(relationId);
                } else {
                    // Select only self
                    model.selectionModel.clear();
                    model.selectionModel.relation.add(relationId);
                }
            };

            // A Swithing point to change a behavior when relation is clicked.
            var jsPlumbConnectionClickedImpl = null;

            // A relation is drawn by a jsPlumbConnection.
            // The EventHandlar for clieck event of jsPlumbConnection. 
            var jsPlumbConnectionClicked = function(jsPlumbConnection, event) {
                if (jsPlumbConnectionClickedImpl) {
                    jsPlumbConnectionClickedImpl(jsPlumbConnection, event);
                }

                cancelBubble(event);
                return false;
            };

            var editorSelected = function() {
                controller.userEvent.viewHandler.hideDialogs();

                // Select this editor.
                editor.tool.selectMe();
                view.viewModel.buttonStateHelper.propagate();
            };

            // A command is an operation by user that is saved as history, and can undo and redo.
            // Users can edit model only via commands. 
            var command = textAeUtil.extendBindable(function() {
                // histories of edit to undo and redo.
                var history = function() {
                    var lastSaveIndex = -1,
                        lastEditIndex = -1,
                        history = [],
                        hasAnythingToUndo = function() {
                            return lastEditIndex > -1;
                        },
                        hasAnythingToRedo = function() {
                            return lastEditIndex < history.length - 1;
                        },
                        hasAnythingToSave = function() {
                            return lastEditIndex != lastSaveIndex;
                        },
                        trigger = function() {
                            command.trigger('change', {
                                hasAnythingToSave: hasAnythingToSave(),
                                hasAnythingToUndo: hasAnythingToUndo(),
                                hasAnythingToRedo: hasAnythingToRedo()
                            });
                        };

                    return {
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
                        hasAnythingToSave: hasAnythingToSave,
                        hasAnythingToUndo: hasAnythingToUndo,
                        hasAnythingToRedo: hasAnythingToRedo
                    };
                }();

                var invoke = function(commands) {
                    commands.forEach(function(command) {
                        command.execute();
                    });
                };

                return {
                    reset: function(annotation) {
                        model.annotationData.reset(annotation);
                        history.reset();
                    },
                    updateSavePoint: function() {
                        history.saved();
                    },
                    hasAnythingToSave: history.hasAnythingToSave,
                    invoke: function(commands) {
                        if (commands && commands.length > 0) {
                            invoke(commands);
                            history.push(commands);
                        }
                    },
                    undo: function() {
                        var getRevertCommands = function(commands) {
                            commands = Object.create(commands);
                            commands.reverse();
                            return commands.map(function(originCommand) {
                                return originCommand.revert();
                            });
                        };

                        if (history.hasAnythingToUndo()) {
                            model.selectionModel.clear();
                            invoke(getRevertCommands(history.prev()));
                        }
                    },
                    redo: function() {
                        if (history.hasAnythingToRedo()) {
                            model.selectionModel.clear();
                            invoke(history.next());
                        }
                    },
                    factory: function() {
                        var debugLog = function(message) {
                            // For debug
                            console.log('[command.invoke]', message);
                        };

                        return {
                            spanCreateCommand: function(span) {
                                return {
                                    execute: function() {
                                        // model
                                        var newSpan = model.annotationData.span.add({
                                            begin: span.begin,
                                            end: span.end
                                        });

                                        // select
                                        model.selectionModel.span.add(newSpan.id);

                                        this.revert = _.partial(command.factory.spanRemoveCommand, newSpan.id);

                                        debugLog('create a new span, spanId:' + newSpan.id);
                                    }
                                };
                            },
                            spanRemoveCommand: function(spanId) {
                                return {
                                    execute: function() {
                                        var span = model.annotationData.span.get(spanId);

                                        // model
                                        model.annotationData.span.remove(spanId);

                                        this.revert = _.partial(command.factory.spanCreateCommand, {
                                            begin: span.begin,
                                            end: span.end
                                        });

                                        debugLog('remove a span, spanId:' + spanId);
                                    }
                                };
                            },
                            spanMoveCommand: function(spanId, begin, end) {
                                return {
                                    execute: function() {
                                        var commands = [];
                                        var newSpanId = idFactory.makeSpanId(begin, end);

                                        if (!model.annotationData.span.get(newSpanId)) {
                                            commands.push(command.factory.spanRemoveCommand(spanId));
                                            commands.push(command.factory.spanCreateCommand({
                                                begin: begin,
                                                end: end
                                            }));
                                            model.annotationData.span.get(spanId).getTypes().forEach(function(type) {
                                                type.entities.forEach(function(entityId) {
                                                    commands.push(command.factory.entityCreateCommand(newSpanId, type.name, entityId));
                                                });
                                            });
                                        }

                                        commands.forEach(function(command) {
                                            command.execute();
                                        });

                                        var oldBeginEnd = idFactory.parseSpanId(spanId);
                                        this.revert = _.partial(command.factory.spanMoveCommand, newSpanId, oldBeginEnd.begin, oldBeginEnd.end);

                                        debugLog('move a span, spanId:' + spanId + ', newBegin:' + begin + ', newEnd:' + end);
                                    },
                                };
                            },
                            spanReplicateCommand: function(span) {
                                var makeRevert = function(commands) {
                                    var revertedCommands = commands.map(function(command) {
                                        return command.revert();
                                    });

                                    return function() {
                                        return {
                                            execute: function() {
                                                revertedCommands.forEach(function(command) {
                                                    command.execute();
                                                });
                                                debugLog('revert replicate a span, begin:' + span.begin + ', end:' + span.end);
                                            }
                                        };
                                    };
                                };

                                return {
                                    execute: function() {
                                        var commands = model.getReplicationSpans(span, controller.spanConfig)
                                            .map(command.factory.spanCreateCommand);

                                        commands.forEach(function(command) {
                                            command.execute();
                                        });

                                        var revertedCommands = commands.map(function(command) {
                                            return command.revert();
                                        });

                                        this.revert = makeRevert(commands);

                                        debugLog('replicate a span, begin:' + span.begin + ', end:' + span.end);
                                    }
                                };
                            },
                            entityCreateCommand: function(spanId, typeName, entityId) {
                                return {
                                    execute: function() {
                                        // model
                                        var newEntity = model.annotationData.entity.add({
                                            id: entityId,
                                            span: spanId,
                                            type: typeName
                                        });

                                        // select
                                        model.selectionModel.entity.add(newEntity.id);

                                        // Set revert
                                        this.revert = _.partial(command.factory.entityRemoveCommand, newEntity.id, spanId, typeName);

                                        debugLog('create a new entity, spanId:' + spanId + ', type:' + typeName + '  entityId:' + newEntity.id);
                                    }
                                };
                            },
                            entityRemoveCommand: function(entityId, spanId, typeName) {
                                return {
                                    execute: function() {
                                        var entity = model.annotationData.entity.get(entityId);

                                        // model
                                        model.annotationData.entity.remove(entityId);

                                        this.revert = _.partial(command.factory.entityCreateCommand, entity.span, entity.type, entityId);

                                        debugLog('remove a entity, spanId:' + entity.span + ', type:' + entity.type + ', entityId:' + entityId);
                                    },
                                };
                            },
                            entityChangeTypeCommand: function(entityId, newType) {
                                return {
                                    execute: function() {
                                        var oldType = model.annotationData.entity.get(entityId).type;

                                        var changedEntity = model.annotationData.entity.changeType(entityId, newType);

                                        this.revert = _.partial(command.factory.entityChangeTypeCommand, entityId, oldType);

                                        debugLog('change type of a entity, spanId:' + changedEntity.span + ', type:' + oldType + ', entityId:' + entityId + ', newType:' + newType);
                                    }
                                };
                            },
                            // The relaitonId is optional set only when revert of the relationRemoveCommand.
                            relationCreateCommand: function(subject, object, predicate, relationId) {
                                return {
                                    execute: function() {
                                        // Add relation to model
                                        var newRelation = model.annotationData.relation.add({
                                            id: relationId,
                                            pred: predicate,
                                            subj: subject,
                                            obj: object
                                        });

                                        // Selection
                                        // Set the css class lately, because jsPlumbConnector is no applyed that css class immediately after create.
                                        _.delay(_.partial(model.selectionModel.relation.add, newRelation.id), 100);

                                        // Set Revert
                                        this.revert = _.partial(command.factory.relationRemoveCommand, newRelation.id);

                                        debugLog('create a new relation relationId:' + newRelation.id + ', subject:' + subject + ', object:' + object + ', predicate:' + predicate);
                                    }
                                };
                            },
                            relationRemoveCommand: function(relationId) {
                                return {
                                    execute: function() {
                                        var relation = model.annotationData.relation.get(relationId);
                                        var subject = relation.subj;
                                        var object = relation.obj;
                                        var predicate = relation.pred;

                                        model.annotationData.relation.remove(relationId);

                                        this.revert = _.partial(command.factory.relationCreateCommand, subject, object, predicate, relationId);

                                        debugLog('remove a relation relationId:' + relationId + ', subject:' + subject + ', object:' + object + ', predicate:' + predicate);
                                    }
                                };
                            },
                            relationChangePredicateCommand: function(relationId, predicate) {
                                return {
                                    execute: function() {
                                        var oldPredicate = model.annotationData.relation.get(relationId).pred;

                                        model.annotationData.relation.changePredicate(relationId, predicate);

                                        this.revert = _.partial(command.factory.relationChangePredicateCommand, relationId, oldPredicate);

                                        debugLog('change predicate of relation, relationId:' + relationId + ', subject:' + model.annotationData.relation.get(relationId).subj + ', object:' + model.annotationData.relation.get(relationId).obj + ', predicate:' + oldPredicate + ', newPredicate:' + predicate);
                                    }
                                };
                            }
                        };
                    }(),
                };
            }());

            var userEvent = function() {
                // changeEventHandler will init.
                var changeTypeOfSelected;

                return {
                    // User event to edit model
                    editHandler: function() {
                        return {
                            replicate: function() {
                                var spanId = model.selectionModel.span.single();
                                if (spanId) {
                                    command.invoke(
                                        [command.factory.spanReplicateCommand(
                                            model.annotationData.span.get(spanId)
                                        )]
                                    );
                                } else {
                                    alert('You can replicate span annotation when there is only span selected.');
                                }
                            },
                            createEntity: function() {
                                var commands = model.selectionModel.span.all().map(function(spanId) {
                                    return command.factory.entityCreateCommand(spanId, view.viewModel.typeContainer.entity.getDefaultType());
                                });

                                command.invoke(commands);
                            },
                            // set the type of an entity
                            setEntityType: function() {
                                var newType = $(this).attr('label');
                                changeTypeOfSelected(newType);
                                return false;
                            },
                            newLabel: function() {
                                if (model.selectionModel.entity.some() || model.selectionModel.relation.some()) {
                                    var newTypeLabel = prompt("Please enter a new label", "");
                                    if (newTypeLabel) {
                                        changeTypeOfSelected(newTypeLabel);
                                    }
                                }
                            },
                            removeSelectedElements: function() {
                                var removeCommand = function() {
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
                                            relationIds = relationIds.concat(addedRelations);
                                        },
                                        getAll: function() {
                                            return _.uniq(relationIds).map(command.factory.relationRemoveCommand)
                                                .concat(
                                                    _.uniq(entityIds).map(function(entity) {
                                                        // Wrap by a anonymous function, because command.factory.entityRemoveCommand has two optional arguments.
                                                        return command.factory.entityRemoveCommand(entity);
                                                    }),
                                                    _.uniq(spanIds).map(command.factory.spanRemoveCommand));
                                        },
                                    };
                                }();

                                var removeEnitity = function(entityId) {
                                    removeCommand.addEntityId(entityId);
                                    removeCommand.addRelations(model.annotationData.entity.assosicatedRelations(entityId));
                                };

                                //remove spans
                                model.selectionModel.span.all().forEach(function(spanId) {
                                    removeCommand.addSpanId(spanId);

                                    model.annotationData.span.get(spanId).getTypes().forEach(function(type) {
                                        type.entities.forEach(function(entityId) {
                                            removeEnitity(entityId);
                                        });
                                    });
                                });

                                //remove entities
                                model.selectionModel.entity.all().forEach(function(entityId) {
                                    //an entity element has the entityId in title. an id is per Editor.
                                    removeEnitity(entityId);
                                });

                                //remove relations
                                removeCommand.addRelations(model.selectionModel.relation.all());

                                command.invoke(removeCommand.getAll());
                            },
                            copyEntities: function() {
                                // Unique Entities. Because a entity is deplicate When a span and thats entity is selected.
                                view.viewModel.clipBoard = _.uniq(
                                    function getEntitiesFromSelectedSpan() {
                                        return _.flatten(model.selectionModel.span.all().map(function(spanId) {
                                            return model.annotationData.span.get(spanId).getEntities();
                                        }));
                                    }().concat(
                                        model.selectionModel.entity.all()
                                    )
                                );
                            },
                            pasteEntities: function() {
                                // Make commands per selected spans from entities in clipBord. 
                                var commands = _.flatten(model.selectionModel.span.all().map(function(spanId) {
                                    // The view.viewModel.clipBoard has enitityIds.
                                    return view.viewModel.clipBoard.map(function(entityId) {
                                        return command.factory.entityCreateCommand(spanId, model.annotationData.entity.get(entityId).type);
                                    });
                                }));

                                command.invoke(commands);
                            }
                        };
                    }(),
                    // User event that does not change data.
                    viewHandler: function() {
                        // The Reference to content to be shown in the pallet.
                        var palletConfig = {};

                        var eventHandlerComposer = function() {
                            var changeType = function(getIdsFunction, createChangeTypeCommandFunction, newType) {
                                    var ids = getIdsFunction();
                                    if (ids.length > 0) {
                                        var commands = ids.map(function(id) {
                                            return createChangeTypeCommandFunction(id, newType);
                                        });

                                        command.invoke(commands);
                                    }
                                },
                                unbindAllEventhandler = function() {
                                    return editor
                                        .off('mouseup', '.textae-editor__body')
                                        .off('mouseup', '.textae-editor__span')
                                        .off('mouseup', '.textae-editor__type-label')
                                        .off('mouseup', '.textae-editor__entity-pane')
                                        .off('mouseup', '.textae-editor__entity');
                                };

                            return {
                                relationEdit: function() {
                                    var entityClickedAtRelationMode = function(e) {
                                        if (!model.selectionModel.entity.some()) {
                                            model.selectionModel.clear();
                                            model.selectionModel.entity.add($(e.target).attr('title'));
                                        } else {
                                            // Cannot make a self reference relation.
                                            var subjectEntityId = model.selectionModel.entity.all()[0];
                                            var objectEntityId = $(e.target).attr('title');

                                            if (subjectEntityId === objectEntityId) {
                                                // Deslect already selected entity.
                                                model.selectionModel.entity.remove(subjectEntityId);
                                            } else {
                                                model.selectionModel.entity.add(objectEntityId);
                                                _.defer(function() {
                                                    command.invoke([command.factory.relationCreateCommand(
                                                        subjectEntityId,
                                                        objectEntityId,
                                                        view.viewModel.typeContainer.relation.getDefaultType()
                                                    )]);

                                                    if (e.ctrlKey || e.metaKey) {
                                                        // Remaining selection of the subject entity.
                                                        model.selectionModel.entity.remove(objectEntityId);
                                                    } else if (e.shiftKey) {
                                                        view.domUtil.manipulate.dismissBrowserSelection();
                                                        model.selectionModel.entity.remove(subjectEntityId);
                                                        model.selectionModel.entity.add(objectEntityId);
                                                        return false;
                                                    } else {
                                                        model.selectionModel.entity.remove(subjectEntityId);
                                                        model.selectionModel.entity.remove(objectEntityId);
                                                    }
                                                });
                                            }
                                        }
                                    };

                                    // Control only entities and relations.
                                    unbindAllEventhandler()
                                        .on('mouseup', '.textae-editor__entity', entityClickedAtRelationMode);

                                    palletConfig.typeContainer = view.viewModel.typeContainer.relation;
                                    changeTypeOfSelected = _.partial(changeType, model.selectionModel.relation.all, command.factory.relationChangePredicateCommand);

                                    jsPlumbConnectionClickedImpl = selectRelation;
                                },
                                noRelationEdit: function() {
                                    var entityClicked = function(e) {
                                        var $target = $(e.target);
                                        if (e.ctrlKey || e.metaKey) {
                                            model.selectionModel.entity.toggle($target.attr('title'));
                                        } else {
                                            model.selectionModel.clear();
                                            model.selectionModel.entity.add($target.attr('title'));
                                        }
                                        return false;
                                    };

                                    unbindAllEventhandler()
                                        .on('mouseup', '.textae-editor__body', bodyClicked)
                                        .on('mouseup', '.textae-editor__span', spanClicked)
                                        .on('mouseup', '.textae-editor__type-label', typeLabelClicked)
                                        .on('mouseup', '.textae-editor__entity-pane', entityPaneClicked)
                                        .on('mouseup', '.textae-editor__entity', entityClicked);

                                    palletConfig.typeContainer = view.viewModel.typeContainer.entity;
                                    changeTypeOfSelected = _.partial(changeType, model.selectionModel.entity.all, command.factory.entityChangeTypeCommand);

                                    jsPlumbConnectionClickedImpl = null;
                                },
                                noEdit: function() {
                                    unbindAllEventhandler();

                                    palletConfig.typeContainer = null;
                                    changeTypeOfSelected = null;

                                    jsPlumbConnectionClickedImpl = null;
                                }
                            };
                        }();

                        var controllerState = function() {
                            var resetView = function() {
                                controller.userEvent.viewHandler.hideDialogs();
                                model.selectionModel.clear();
                            };

                            var transition = {
                                toTerm: function() {
                                    resetView();
                                    eventHandlerComposer.noRelationEdit();
                                    view.viewModel.viewMode.setTerm();

                                    controllerState = state.termCentric;
                                },
                                toInstance: function() {
                                    resetView();
                                    eventHandlerComposer.noRelationEdit();
                                    view.viewModel.viewMode.setInstance();

                                    controllerState = state.instanceRelation;
                                },
                                toRelation: function() {
                                    resetView();
                                    eventHandlerComposer.relationEdit();
                                    view.viewModel.viewMode.setRelation();

                                    controllerState = state.relationEdit;
                                },
                                toViewTerm: function() {
                                    resetView();
                                    eventHandlerComposer.noEdit();
                                    view.viewModel.viewMode.setTerm();

                                    controllerState = state.viewTerm;
                                },
                                toViewInstance: function() {
                                    resetView();
                                    eventHandlerComposer.noEdit();
                                    view.viewModel.viewMode.setInstance();

                                    controllerState = state.viewInstance;
                                }
                            };

                            var doNothing = function() {};
                            var state = {
                                termCentric: _.extend({}, transition, {
                                    name: 'Term Centric',
                                    toTerm: doNothing
                                }),
                                instanceRelation: _.extend({}, transition, {
                                    name: 'Instance / Relation',
                                    toInstance: doNothing,
                                }),
                                relationEdit: _.extend({}, transition, {
                                    name: 'Relation Edit',
                                    toRelation: doNothing
                                }),
                                viewTerm: _.extend({}, transition, {
                                    name: 'View Only',
                                    toTerm: doNothing,
                                    toInstance: transition.toViewInstance,
                                    toRelation: doNothing,
                                    toViewTerm: doNothing
                                }),
                                viewInstance: _.extend({}, transition, {
                                    name: 'View Only',
                                    toTerm: transition.toViewTerm,
                                    toInstance: doNothing,
                                    toRelation: doNothing,
                                    toViewInstance: doNothing
                                })
                            };

                            return {
                                // Init as TermCentricState
                                init: function() {
                                    transition.toTerm();
                                }
                            };
                        }();

                        // Redraw all editors in tha windows.
                        var redrawAllEditor = function() {
                            $(window).trigger('resize');
                        };

                        var debounce300 = function(func) {
                            return _.debounce(func, 300);
                        };

                        var sixteenTimes = function(val) {
                            return val * 16;
                        };

                        var changeLineHeight = debounce300(_.compose(redrawAllEditor, view.renderer.helper.changeLineHeight, sixteenTimes));

                        var changeTypeGap = debounce300(view.renderer.helper.changeTypeGap);

                        return {
                            init: function() {
                                controllerState.init();
                            },
                            showPallet: function() {
                                var hideAndDo = function(doFunction) {
                                    return function() {
                                        controller.userEvent.viewHandler.hidePallet();
                                        doFunction.call(this);
                                    };
                                };

                                var makePalletRow = function(typeContainer) {
                                    var makeRadioButton = function(typeName) {
                                        // The event handler is bound direct,because jQuery detects events of radio buttons directly only.
                                        var $radioButton = $('<input>')
                                            .addClass('textae-editor__entity-pallet__entity-type__radio')
                                            .attr({
                                                'type': 'radio',
                                                'name': 'etype',
                                                'label': typeName
                                            }).change(hideAndDo(function() {
                                                typeContainer.setDefaultType($(this).attr('label'));
                                                return false;
                                            }));

                                        // Select the radio button if it is default type.
                                        if (typeName === typeContainer.getDefaultType()) {
                                            $radioButton.attr({
                                                'title': 'default type',
                                                'checked': 'checked'
                                            });
                                        }
                                        return $radioButton;
                                    };

                                    var makeLink = function(uri) {
                                        if (uri) {
                                            return $('<a>')
                                                .attr({
                                                    'href': uri,
                                                    'target': '_blank'
                                                })
                                                .append($('<span>').addClass('textae-editor__entity-pallet__link'));
                                        }
                                    };

                                    var wrapTd = function($element) {
                                        if ($element) {
                                            return $('<td>').append($element);
                                        } else {
                                            return $('<td>');
                                        }
                                    };

                                    var makeColumn1 = _.compose(wrapTd, makeRadioButton);

                                    var makeColumn2 = function(typeName) {
                                        return $('<td>')
                                            .addClass('textae-editor__entity-pallet__entity-type__label')
                                            .attr('label', typeName)
                                            .text(typeName);
                                    };

                                    var makeColumn3 = _.compose(wrapTd, makeLink, typeContainer.getUri);

                                    return typeContainer.getSortedNames().map(function(typeName) {
                                        var $column1 = makeColumn1(typeName);
                                        var $column2 = makeColumn2(typeName);
                                        var $column3 = makeColumn3(typeName);

                                        return $('<tr>')
                                            .addClass('textae-editor__entity-pallet__entity-type')
                                            .css({
                                                'background-color': typeContainer.getColor(typeName)
                                            })
                                            .append([$column1, $column2, $column3]);
                                    });
                                };

                                var createEmptyPallet = function(setTypeFunction) {
                                    return $('<div>')
                                        .addClass("textae-editor__entity-pallet")
                                        .append($('<table>'))
                                        .css('position', 'fixed')
                                        .on('click', '.textae-editor__entity-pallet__entity-type__label', hideAndDo(setTypeFunction))
                                        .hide();
                                };

                                var reuseOldPallet = function($pallet) {
                                    var $oldPallet = $('.textae-editor__entity-pallet');
                                    if ($oldPallet.length !== 0) {
                                        return $oldPallet.find('table').empty().end().css('width', 'auto');
                                    } else {
                                        // Append the pallet to body to show on top.
                                        $("body").append($pallet);
                                        return $pallet;
                                    }
                                };

                                var appendRows = function($pallet) {
                                    return $pallet.find("table")
                                        .append(makePalletRow(palletConfig.typeContainer))
                                        .end();
                                };

                                var setMaxHeight = function($pallet) {
                                    // Show the scrollbar-y if the height of the pallet is same witch max-height.
                                    if ($pallet.outerHeight() + 'px' === $pallet.css('max-height')) {
                                        return $pallet.css('overflow-y', 'scroll');
                                    } else {
                                        return $pallet.css('overflow-y', '');
                                    }
                                };

                                var makePallet = _.compose(setMaxHeight, appendRows, reuseOldPallet, createEmptyPallet);

                                return function(point) {
                                    if (palletConfig.typeContainer && palletConfig.typeContainer.getSortedNames().length > 0) {
                                        // Move the pallet to mouse.
                                        makePallet(controller.userEvent.editHandler.setEntityType)
                                            .css(point)
                                            .show();
                                    }
                                };
                            }(),
                            hidePallet: function() {
                                $('.textae-editor__entity-pallet').hide();
                            },
                            hideDialogs: function() {
                                controller.userEvent.viewHandler.hidePallet();
                                editor.tool.cancel();
                            },
                            redraw: function() {
                                view.renderer.helper.redraw();
                            },
                            cancelSelect: function() {
                                // if drag, bubble up
                                if (!window.getSelection().isCollapsed) {
                                    view.domUtil.manipulate.dismissBrowserSelection();
                                    return true;
                                }

                                model.selectionModel.clear();
                                controller.userEvent.viewHandler.hideDialogs();
                            },
                            selectLeftSpan: function() {
                                var spanId = model.selectionModel.span.single();
                                if (spanId) {
                                    var span = model.annotationData.span.get(spanId);
                                    model.selectionModel.clear();
                                    if (span.left) {
                                        model.selectionModel.span.add(span.left.id);
                                    }
                                }
                            },
                            selectRightSpan: function() {
                                var spanId = model.selectionModel.span.single();
                                if (spanId) {
                                    var span = model.annotationData.span.get(spanId);
                                    model.selectionModel.clear();
                                    if (span.right) {
                                        model.selectionModel.span.add(span.right.id);
                                    }
                                }
                            },
                            showSettingDialog: function() {
                                var typeGapValue;

                                return function() {
                                    var content = function() {
                                            return $('<div>')
                                                .addClass('textae-editor__setting-dialog');
                                        },
                                        lineHeight = function($content) {
                                            return $content
                                                .append($('<div>')
                                                    .append('<label class="textae-editor__setting-dialog__label">Line Height')
                                                    .append($('<input>')
                                                        .attr({
                                                            'type': 'number',
                                                            'step': 1,
                                                            'min': 3,
                                                            'max': 10,
                                                            'value': view.renderer.helper.getLineHeight(),
                                                        })
                                                        .addClass('textae-editor__setting-dialog__line-height')
                                                    ))
                                                .on('change', '.textae-editor__setting-dialog__line-height', function() {
                                                    changeLineHeight($(this).val());
                                                });
                                        },
                                        instanceRelationView = function($content) {
                                            return $content.append($('<div>')
                                                    .append('<label class="textae-editor__setting-dialog__label">Instance/Relation View')
                                                    .append($('<input>')
                                                        .attr({
                                                            'type': 'checkbox'
                                                        })
                                                        .addClass('textae-editor__setting-dialog__term-centric-view')
                                                    )
                                                )
                                                .on('click', '.textae-editor__setting-dialog__term-centric-view', function() {
                                                    if ($(this).is(':checked')) {
                                                        controllerState.toInstance();
                                                    } else {
                                                        controllerState.toTerm();
                                                    }
                                                });
                                        },
                                        typeGap = function($content) {
                                            return $content.append($('<div>')
                                                .append('<label class="textae-editor__setting-dialog__label">Type Gap')
                                                .append($('<input>')
                                                    .attr({
                                                        type: 'number',
                                                        step: 1,
                                                        min: 0,
                                                        max: 5
                                                    }).addClass('textae-editor__setting-dialog__type_gap')
                                                )
                                            ).on('change', '.textae-editor__setting-dialog__type_gap', function() {
                                                typeGapValue = $(this).val();
                                                changeTypeGap(typeGapValue);
                                            });
                                        },
                                        dialog = function($content) {
                                            return textAeUtil.getDialog(editor.editorId, 'textae.dialog.setting', 'Chage Settings', $content, true);
                                        },
                                        // Update the checkbox state, because it is updated by the button on control too.
                                        updateViewMode = function($dialog) {
                                            return $dialog.find('.textae-editor__setting-dialog__term-centric-view')
                                                .prop({
                                                    'checked': view.viewModel.viewMode.isTerm() ? null : 'checked'
                                                })
                                                .end();
                                        },
                                        updateTypeGapValue = function($dialog) {
                                            return $dialog.find('.textae-editor__setting-dialog__type_gap')
                                                .prop({
                                                    value: typeGapValue ? typeGapValue : view.viewModel.viewMode.isTerm() ? 0 : 1
                                                })
                                                .end();
                                        },
                                        // Open the dialog.
                                        open = function($dialog) {
                                            return $dialog.open();
                                        };

                                    _.compose(open, updateTypeGapValue, updateViewMode, dialog, typeGap, instanceRelationView, lineHeight, content)();
                                };
                            }(),
                            toggleRelationEditMode: function() {
                                // ビューモードを切り替える
                                if (view.viewModel.modeAccordingToButton['relation-edit-mode'].value()) {
                                    controllerState.toInstance();
                                } else {
                                    controllerState.toRelation();
                                }
                            },
                            setViewMode: function(mode) {
                                if (controllerState['to' + mode]) {
                                    controllerState['to' + mode]();
                                }
                            }
                        };
                    }()
                };
            }();

            // Configulation of span
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
                    if (this.delimiterCharacters.indexOf('ANY') >= 0) {
                        return 1;
                    }
                    return (this.delimiterCharacters.indexOf(char) >= 0);
                }
            };

            return {
                init: function(confirmDiscardChangeMessage) {
                    // Prevent the default selection by the browser with shift keies.
                    editor.on('mousedown', function(e) {
                        if (e.shiftKey) {
                            return false;
                        }
                    }).on('mousedown', '.textae-editor__type', function() {
                        // Prevent a selection of a type by the double-click.
                        return false;
                    }).on('mousedown', '.textae-editor__body__text-box__paragraph-margin', function(e) {
                        // Prevent a selection of a margin of a paragraph by the double-click.
                        if (e.target.className === 'textae-editor__body__text-box__paragraph-margin') return false;
                    });

                    // Bind user input event to handler
                    editor
                        .on('mouseup', '.textae-editor__body,.textae-editor__span,.textae-editor__grid,.textae-editor__entity', editorSelected)
                        .on('mouseenter', '.textae-editor__entity', function(e) {
                            view.domUtil.hover.on($(this).attr('title'));
                        }).on('mouseleave', '.textae-editor__entity', function(e) {
                            view.domUtil.hover.off($(this).attr('title'));
                        });


                    // The jsPlumbConnetion has an original event mecanism.
                    // We can only bind the connection directory.
                    editor
                        .on('textae.editor.jsPlumbConnection.add', function(event, jsPlumbConnection) {
                            jsPlumbConnection.bind('click', jsPlumbConnectionClicked);
                        });

                    command.bind('change', function(state) {
                        //change button state
                        view.viewModel.buttonStateHelper.enabled("write", state.hasAnythingToSave);
                        view.viewModel.buttonStateHelper.enabled("undo", state.hasAnythingToUndo);
                        view.viewModel.buttonStateHelper.enabled("redo", state.hasAnythingToRedo);

                        //change leaveMessage show
                        window.onbeforeunload = state.hasAnythingToSave ? function() {
                            return confirmDiscardChangeMessage;
                        } : null;
                    });

                    controller.userEvent.viewHandler.init();
                },
                command: command,
                userEvent: userEvent,
                spanConfig: spanConfig
            };
        }(this);

        // public funcitons of editor
        this.api = function(editor) {
            var getParams = function(editor) {
                    // Read model parameters from url parameters and html attributes.
                    var params = $.extend(textAeUtil.getUrlParameters(location.search),
                        // Html attributes preced url parameters.
                        {
                            config: editor.attr('config'),
                            target: editor.attr('target'),
                            mode: editor.attr('mode')
                        });

                    // Read Html text and clear it.  
                    var inlineAnnotation = editor.text();
                    editor.empty();

                    // Set annotaiton parameters.
                    params.annotation = {
                        inlineAnnotation: inlineAnnotation,
                        url: params.target
                    };

                    return params;
                },
                changeViewMode = function(prefix) {
                    var maxHeight = _.max(model.annotationData.span.all().map(function(span) {
                        var height = 23;
                        var countHeight = function(span) {
                            height += span.getTypes().length * 36 + 2;
                            if (span.parent) {
                                countHeight(span.parent);
                            }
                        };

                        countHeight(span);

                        return height;
                    }).concat(23));

                    console.log(maxHeight);



                    prefix = prefix || '';
                    // Change view mode accoding to the annotation data.
                    if (model.annotationData.relation.some()) {
                        view.renderer.helper.changeLineHeight(10 * 16);
                        controller.userEvent.viewHandler.setViewMode(prefix + 'Instance');
                    } else if (model.annotationData.span.multiEntities().length > 0) {
                        view.renderer.helper.changeLineHeight(4 * 16);
                        controller.userEvent.viewHandler.setViewMode(prefix + 'Instance');
                    } else {
                        view.renderer.helper.changeLineHeight(4 * 16);
                        controller.userEvent.viewHandler.setViewMode(prefix + 'Term');
                    }
                },
                changeViewModeWithEdit = _.partial(changeViewMode, ''),
                changeViewModeWithoutEdit = _.compose(function() {
                    view.viewModel.buttonStateHelper.enabled('replicate-auto', false);
                    view.viewModel.buttonStateHelper.enabled('relation-edit-mode', false);
                }, _.partial(changeViewMode, 'View')),
                setConfigByParams = function(params, dataAccessObject) {
                    var setConfig = function(params) {
                            var setTypeConfig = function(config) {
                                view.viewModel.typeContainer.setDefinedEntityTypes(config['entity types']);
                                view.viewModel.typeContainer.setDefinedRelationTypes(config['relation types']);

                                if (config.css !== undefined) {
                                    $('#css_area').html('<link rel="stylesheet" href="' + config.css + '"/>');
                                }
                            };

                            // Read default controller.spanConfig
                            controller.spanConfig.set();

                            if (params.config !== '') {
                                // Load sync, because load annotation after load config. 
                                var configFromServer = textAeUtil.ajaxAccessor.getSync(params.config);
                                if (configFromServer !== null) {
                                    controller.spanConfig.set(configFromServer);
                                    setTypeConfig(configFromServer);
                                } else {
                                    alert('could not read the span configuration from the location you specified.');
                                }
                            }
                        },
                        bindChangeViewMode = function(params) {
                            var changeViewMode = params.mode === 'edit' ?
                                changeViewModeWithEdit :
                                changeViewModeWithoutEdit;
                            model.annotationData.bind('all.change', changeViewMode);
                        },
                        loadAnnotation = function(params) {
                            var annotation = params.annotation;
                            if (annotation) {
                                if (annotation.inlineAnnotation) {
                                    // Set an inline annotation.
                                    controller.command.reset(JSON.parse(annotation.inlineAnnotation));
                                    _.defer(controller.userEvent.viewHandler.redraw);
                                } else if (annotation.url) {
                                    // Load an annotation from server.
                                    dataAccessObject.getAnnotationFromServer(annotation.url);
                                }
                            }
                        };

                    setConfig(params);
                    bindChangeViewMode(params);
                    loadAnnotation(params);
                },
                // Functions will be called from handleKeyInput and handleButtonClick.
                showAccess,
                showSave,
                initDao = function(confirmDiscardChangeMessage) {
                    var dataAccessObject = makeDataAccessObject(editor, confirmDiscardChangeMessage);
                    dataAccessObject.bind('save', controller.command.updateSavePoint);
                    dataAccessObject.bind('load', controller.command.reset);

                    showAccess = function() {
                        dataAccessObject.showAccess(controller.command.hasAnythingToSave());
                    };

                    showSave = function() {
                        dataAccessObject.showSave(model.annotationData.toJson());
                    };

                    return dataAccessObject;
                },
                handleKeyInput = function(key, mousePoint) {
                    var keyApiMap = {
                        'A': showAccess,
                        'C': controller.userEvent.editHandler.copyEntities,
                        'D': controller.userEvent.editHandler.removeSelectedElements,
                        'DEL': controller.userEvent.editHandler.removeSelectedElements,
                        'E': controller.userEvent.editHandler.createEntity,
                        'Q': controller.userEvent.viewHandler.showPallet,
                        'R': controller.userEvent.editHandler.replicate,
                        'S': showSave,
                        'V': controller.userEvent.editHandler.pasteEntities,
                        'W': controller.userEvent.editHandler.newLabel,
                        'X': controller.command.redo,
                        'Y': controller.command.redo,
                        'Z': controller.command.undo,
                        'ESC': controller.userEvent.viewHandler.cancelSelect,
                        'LEFT': controller.userEvent.viewHandler.selectLeftSpan,
                        'RIGHT': controller.userEvent.viewHandler.selectRightSpan,
                    };
                    if (keyApiMap[key]) {
                        keyApiMap[key](mousePoint);
                    }
                },
                handleButtonClick = function(name, mousePoint) {
                    var buttonApiMap = {
                        'textae.control.button.read.click': showAccess,
                        'textae.control.button.write.click': showSave,
                        'textae.control.button.undo.click': controller.command.undo,
                        'textae.control.button.redo.click': controller.command.redo,
                        'textae.control.button.replicate.click': controller.userEvent.editHandler.replicate,
                        'textae.control.button.replicate_auto.click': view.viewModel.modeAccordingToButton['replicate-auto'].toggle,
                        'textae.control.button.relation_edit_mode.click': controller.userEvent.viewHandler.toggleRelationEditMode,
                        'textae.control.button.entity.click': controller.userEvent.editHandler.createEntity,
                        'textae.control.button.change_label.click': controller.userEvent.editHandler.newLabel,
                        'textae.control.button.pallet.click': controller.userEvent.viewHandler.showPallet,
                        'textae.control.button.delete.click': controller.userEvent.editHandler.removeSelectedElements,
                        'textae.control.button.copy.click': controller.userEvent.editHandler.copyEntities,
                        'textae.control.button.paste.click': controller.userEvent.editHandler.pasteEntities,
                        'textae.control.button.setting.click': controller.userEvent.viewHandler.showSettingDialog,
                    };
                    buttonApiMap[name](mousePoint);
                },
                start = function start(editor) {
                    var CONFIRM_DISCARD_CHANGE_MESSAGE = 'There is a change that has not been saved. If you procceed now, you will lose it.';
                    var params = getParams(editor);

                    view.init();
                    controller.init(CONFIRM_DISCARD_CHANGE_MESSAGE);

                    var dataAccessObject = initDao(CONFIRM_DISCARD_CHANGE_MESSAGE);

                    setConfigByParams(params, dataAccessObject);
                };

            return {
                start: start,
                handleKeyInput: handleKeyInput,
                handleButtonClick: handleButtonClick,
                redraw: controller.userEvent.viewHandler.redraw,
            };
        }(this);

        return this;
    };