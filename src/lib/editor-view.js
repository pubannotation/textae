    var View = function(editor, idFactory, model) {
        // The cachedConnectors has jsPlumbConnectors to call jsPlumbConnector instance to edit an according dom object.
        // This is refered by render.relation and domUtil.selector.relation.
        var cachedConnectors = {};
        var toConnector = function(relationId) {
            return cachedConnectors[relationId];
        };

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

        // Data for view.
        var viewModel = function() {
            var TypeContainer = function(getActualTypesFunction, defaultColor) {
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

            var entityContainer = new TypeContainer(model.annotationData.entity.types, '#77DDDD');
            var relationContaier = new TypeContainer(model.annotationData.relation.types, '#555555');

            // Save state of push control buttons.
            var modeAccordingToButton = function() {
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
                var ret = ['replicate-auto', 'relation-edit-mode', 'negation', 'speculation']
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
            }();

            // Save enable/disable state of contorol buttons.
            var buttonEnableStates = function() {
                var states = {},
                    set = function(button, enable) {
                        states[button] = enable;
                    },
                    propagate = function() {
                        editor.tool.changeButtonState(editor, states);
                    };

                return {
                    set: set,
                    propagate: propagate
                };
            }();

            var updateButtonState = function() {
                // Short cut name 
                var s = model.selectionModel,
                    and = function(predicate1, predicate2) {
                        return predicate1() && predicate2();
                    },
                    or = function(predicate1, predicate2) {
                        return predicate1() || predicate2();
                    },
                    hasCopy = function() {
                        return viewModel.clipBoard.length > 0;
                    },
                    sOrE = _.partial(or, s.span.some, s.entity.some),
                    eOrR = _.partial(or, s.entity.some, s.relation.some);


                // Check all associated anntation elements.
                // For exapmle, it should be that buttons associate with entitis is enable,
                // when deselect the span after select a span and an entity.
                var predicates = {
                    replicate: s.span.single,
                    entity: s.span.some,
                    'delete': s.some, // It works well on relation-edit-mode if relations are deselect brefore an entity is select.
                    copy: sOrE,
                    paste: _.partial(and, hasCopy, s.span.some),
                    pallet: eOrR,
                    'change-label': eOrR,
                    negation: eOrR,
                    speculation: eOrR
                };

                return function(buttons) {
                    buttons.forEach(function(buttonName) {
                        buttonEnableStates.set(buttonName, predicates[buttonName]());
                    });
                };
            }();

            // Change push/unpush of buttons of modifications.
            var updateModificationButtons = function() {
                var doesAllModificaionHasSpecified = function(specified, modificationsOfSelectedElement) {
                        return modificationsOfSelectedElement.length > 0 && _.every(modificationsOfSelectedElement, function(m) {
                            return _.contains(m, specified);
                        });
                    },
                    updateModificationButton = function(specified, modificationsOfSelectedElement) {
                        // All modification has specified modification if exits.
                        modeAccordingToButton[specified.toLowerCase()]
                            .value(doesAllModificaionHasSpecified(specified, modificationsOfSelectedElement));
                    };

                return function(selectionModel) {
                    var modifications = selectionModel.all().map(function(e) {
                        return model.annotationData.getModificationOf(e).map(function(m) {
                            return m.pred;
                        });
                    });

                    updateModificationButton('Negation', modifications);
                    updateModificationButton('Speculation', modifications);
                };
            }();

            return {
                // view.viewModel.clipBoard has entity id only.
                clipBoard: [],
                // Modes accoding to buttons of control.
                modeAccordingToButton: modeAccordingToButton,
                // Helper to update button state. 
                buttonStateHelper: function() {
                    var spanButtons = ['replicate', 'entity', 'delete', 'copy', 'paste'],
                        relationButtons = ['pallet', 'change-label', 'negation', 'speculation', 'delete'],
                        entityButtons = relationButtons.concat(['copy']),
                        propagate = _.compose(modeAccordingToButton.propagate, buttonEnableStates.propagate),
                        propagateAfter = _.partial(_.compose, propagate);

                    return {
                        propagate: propagate,
                        enabled: propagateAfter(buttonEnableStates.set),
                        updateBySpan: propagateAfter(_.partial(updateButtonState, spanButtons)),
                        updateByEntity: _.compose(
                            propagate,
                            _.partial(updateModificationButtons, model.selectionModel.entity),
                            _.partial(updateButtonState, entityButtons)
                        ),
                        updateByRelation: _.compose(
                            propagate,
                            _.partial(updateModificationButtons, model.selectionModel.relation),
                            _.partial(updateButtonState, relationButtons)
                        )
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
                            viewModel.modeAccordingToButton['relation-edit-mode'].value(push);
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
                            viewModel.buttonStateHelper.updateByEntity();
                        };

                    return {
                        // This is base value to calculate the position of grids.
                        // Grids cannot be set positon by 'margin-bottom' style.
                        // Because grids is setted 'position:absolute' style in the overlay over spans.
                        // So we caluclate and set 'top' of grids in functions of 'layoutManager.updateDisplay'. 
                        marginBottomOfGrid: 0,
                        isTerm: function() {
                            return editor.hasClass('textae-editor_term-mode');
                        },
                        setTerm: function() {
                            changeCssClass('term');
                            setRelationEditButtonPushed(false);

                            viewModel.viewMode.marginBottomOfGrid = 0;

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

                            viewModel.viewMode.marginBottomOfGrid = 2;

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

                            viewModel.viewMode.marginBottomOfGrid = 2;

                            model.selectionModel
                                .unbind('entity.select', entitySelectChanged)
                                .unbind('entity.deselect', entitySelectChanged)
                                .unbind('entity.change', viewModel.buttonStateHelper.updateByEntity);
                        },
                        setEditable: function(isEditable) {
                            if (isEditable) {
                                editor.addClass('textae-editor_editable');
                            } else {
                                editor.removeClass('textae-editor_editable');
                                viewModel.buttonStateHelper.enabled('replicate-auto', false);
                                viewModel.buttonStateHelper.enabled('relation-edit-mode', false);
                            }
                        }
                    };
                }(),
                typeContainer: {
                    entity: entityContainer,
                    setDefinedEntityTypes: _.partial(setContainerDefinedTypes, entityContainer),
                    relation: relationContaier,
                    setDefinedRelationTypes: _.partial(setContainerDefinedTypes, relationContaier)
                }
            };
        }();

        var Cache = function() {
            var cache = {},
                set = function(key, value) {
                    cache[key] = value;
                    return value;
                },
                get = function(key) {
                    return cache[key];
                },
                remove = function(key) {
                    delete cache[key];
                },
                clear = function() {
                    cache = {};
                };

            return {
                set: set,
                get: get,
                remove: remove,
                clear: clear
            };
        };

        // The chache for position of grids.
        // This is updated at arrange position of grids.
        // This is referenced at create or move relations.
        var gridPositionCache = _.extend(new Cache(), {
            isGridPrepared: function(entityId) {
                var spanId = model.annotationData.entity.get(entityId).span;
                return gridPositionCache.get(spanId);
            }
        });

        // Utility functions for get positions of DOM elemnts.
        var domPositionUtils = function() {
            // The cache for span positions.
            // Getting the postion of spans is too slow about 5-10 ms per a element in Chrome browser. For example offsetTop property.
            // This cache is big effective for the initiation, and little effective for resize. 
            var positionCache = new Cache();

            var useCache = function(prefix, getPositionFunciton, id) {
                var chacheId = prefix + id;
                return positionCache.get(chacheId) ? positionCache.get(chacheId) : positionCache.set(chacheId, getPositionFunciton(id));
            };

            // The posion of the text-box to calculate span postion; 
            var getTextOffset = _.partial(useCache, 'TEXT_NODE', function() {
                return editor.find('.textae-editor__body__text-box').offset();
            });

            var getSpan = function(spanId) {
                var $span = domUtil.selector.span.get(spanId);
                if ($span.length === 0) {
                    throw new Error("span is not renderd : " + spanId);
                }

                var offset = $span.offset();
                return {
                    top: offset.top - getTextOffset().top,
                    left: offset.left - getTextOffset().left,
                    width: $span.outerWidth(),
                    height: $span.outerHeight(),
                    center: $span.get(0).offsetLeft + $span.outerWidth() / 2
                };
            };

            var getEntity = function(entityId) {
                var spanId = model.annotationData.entity.get(entityId).span;

                var $entity = domUtil.selector.entity.get(entityId);
                if ($entity.length === 0) {
                    throw new Error("entity is not rendered : " + entityId);
                }

                var gridPosition = gridPositionCache.get(spanId);
                var entityElement = $entity.get(0);
                return {
                    top: gridPosition.top + entityElement.offsetTop,
                    center: gridPosition.left + entityElement.offsetLeft + $entity.outerWidth() / 2,
                };
            };

            return {
                reset: positionCache.clear,
                getSpan: _.partial(useCache, 'S', getSpan),
                getEntity: _.partial(useCache, 'E', getEntity)
            };
        }();

        // Management position of annotation components.
        var layoutManager = function() {
            var filterChanged = function(span, newPosition) {
                var oldGridPosition = gridPositionCache.get(span.id);
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
                    return domUtil.selector.grid.get(span.id);
                }
            };

            var updateGridPositon = function(span, newPosition) {
                if (newPosition) {
                    getGrid(span).css(newPosition);
                    gridPositionCache.set(span.id, newPosition);
                    arrangeRelationPosition(span);
                    return span;
                }
            };

            var getNewPosition = function(span) {
                var stickGridOnSpan = function(span) {
                    var spanPosition = domPositionUtils.getSpan(span.id);

                    return {
                        'top': spanPosition.top - viewModel.viewMode.marginBottomOfGrid - getGrid(span).outerHeight(),
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

                        return getGrid(span).outerHeight() + descendantsMaxHeight + viewModel.viewMode.marginBottomOfGrid;
                    };

                    var spanPosition = domPositionUtils.getSpan(span.id);
                    var descendantsMaxHeight = getHeightIncludeDescendantGrids(span);

                    return {
                        'top': spanPosition.top - viewModel.viewMode.marginBottomOfGrid - descendantsMaxHeight,
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
                domPositionUtils.reset();
                model.annotationData.span.topLevel()
                    .forEach(function(span) {
                        _.defer(_.partial(arrangePositionGridAndoDescendant, span));
                    });
            };

            return {
                reset: gridPositionCache.clear,
                remove: gridPositionCache.remove,
                updateDisplay: _.throttle(arrangePositionAll, 10)
            };
        }();

        // Render DOM elements conforming with the Model.
        var renderer = function() {
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
                renderer.paragraphs = makeParagraphs(params.paragraphs);
            };

            var reset = function(annotationData) {
                var renderAllSpan = function(annotationData) {
                        // For tuning
                        // var startTime = new Date();

                        annotationData.span.topLevel().forEach(function(span) {
                            rendererImpl.span.render(span);
                        });

                        // For tuning
                        // var endTime = new Date();
                        // console.log('render all span : ', endTime.getTime() - startTime.getTime() + 'ms');
                    },
                    renderAllRelation = function(annotationData) {
                        rendererImpl.relation.reset();
                        annotationData.relation.all().forEach(rendererImpl.relation.render);
                    };

                // Render annotations
                getAnnotationArea().empty();
                layoutManager.reset();
                renderAllSpan(annotationData);

                // Render relations
                renderAllRelation(annotationData);
            };

            var rendererImpl = function() {
                var removeDom = function(target) {
                        return target.remove();
                    },
                    destroyGrid = function(spanId) {
                        removeDom(domUtil.selector.grid.get(spanId));
                        layoutManager.remove(spanId);
                    },
                    gridRenderer = function() {
                        var createGrid = function(container, spanId) {
                                var spanPosition = domPositionUtils.getSpan(spanId);
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
                                gridRenderer.render = _.partial(createGrid, container);
                            };

                        return {
                            init: init,
                            // The render is set at init.
                            render: null
                        };
                    }(),
                    getModificationClasses = function(objectId) {
                        return model.annotationData.getModificationOf(objectId)
                            .map(function(m) {
                                return 'textae-editor__' + m.pred.toLowerCase();
                            }).join(' ');
                    },
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
                                return renderer.paragraphs[paragraphId].element;
                            };

                            var createRangeForFirstSpan = function(getJqueryObjectFunc, span, textaeRange) {
                                var getTextNode = _.compose(getFirstTextNode, getJqueryObjectFunc);
                                var textNode = getTextNode(textaeRange.id);
                                return createSpanRange(span, textaeRange.begin, textNode);
                            };

                            var createRangeForFirstSpanInParent = _.partial(createRangeForFirstSpan, domUtil.selector.span.get);
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

                        return {
                            render: create,
                            remove: destroy
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
                            var oldType = removeDom(domUtil.selector.entity.get(entity.id)).attr('type');

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
                                var isUri = function(type) {
                                        return String(type).indexOf('http') > -1;
                                    },
                                    // Display short name for URL(http or https);
                                    getDisplayName = function(type) {
                                        // For tunning, search the scheme before execute a regular-expression.
                                        if (isUri(type)) {
                                            // The regular-expression to parse URL.
                                            // See detail:
                                            // http://someweblog.com/url-regular-expression-javascript-link-shortener/
                                            var urlRegex = /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/gi;
                                            var matches = urlRegex.exec(type);

                                            if (matches) {
                                                // Order to dispaly.
                                                // 1. The anchor without #.
                                                // 2. The file name with the extention.
                                                // 3. The last directory name.
                                                // 4. The domain name.
                                                return matches[9] ? matches[9].slice(1) :
                                                    matches[6] ? matches[6] + (matches[7] || '') :
                                                    matches[5] ? matches[5].split('/').filter(function(s) {
                                                        return s !== '';
                                                    }).pop() :
                                                    matches[3];
                                            }
                                        }
                                        return type;
                                    },
                                    getUri = function(type) {
                                        if (isUri(type)) {
                                            return type;
                                        } else if (viewModel.typeContainer.entity.getUri(type)) {
                                            return viewModel.typeContainer.entity.getUri(type);
                                        }
                                    },
                                    // A Type element has an entity_pane elment that has a label and will have entities.
                                    createEmptyTypeDomElement = function(spanId, type) {
                                        var typeId = idFactory.makeTypeId(spanId, type);

                                        // The EntityPane will have entities.
                                        var $entityPane = $('<div>')
                                            .attr('id', 'P-' + typeId)
                                            .addClass('textae-editor__entity-pane');

                                        // The label over the span.
                                        var $typeLabel = $('<div>')
                                            .addClass('textae-editor__type-label')
                                            .css({
                                                'background-color': viewModel.typeContainer.entity.getColor(type),
                                            });

                                        // Set the name of the label with uri of the type.
                                        var uri = getUri(type);
                                        if (uri) {
                                            $typeLabel.append(
                                                $('<a target="_blank"/>')
                                                .attr('href', uri)
                                                .text(getDisplayName(type))
                                            );
                                        } else {
                                            $typeLabel.text(getDisplayName(type));
                                        }

                                        return $('<div>')
                                            .attr('id', typeId)
                                            .addClass('textae-editor__type')
                                            .append($typeLabel)
                                            .append($entityPane); // Set pane after label because pane is over label.
                                    };

                                var getGrid = function(spanId) {
                                    // Create a grid unless it exists.
                                    var $grid = domUtil.selector.grid.get(spanId);
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
                                        'border-color': viewModel.typeContainer.entity.getColor(entity.type)
                                    });

                                // Set css classes for modifications.
                                $entity.addClass(getModificationClasses(entity.id));

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

                        var getConnectorStrokeStyle = function(relationId) {
                            var converseHEXinotRGBA = function(color, opacity) {
                                var c = color.slice(1);
                                r = parseInt(c.substr(0, 2), 16);
                                g = parseInt(c.substr(2, 2), 16);
                                b = parseInt(c.substr(4, 2), 16);

                                return 'rgba(' + r + ', ' + g + ', ' + b + ', 1)';
                            };

                            var type = model.annotationData.relation.get(relationId).type;
                            var colorHex = viewModel.typeContainer.relation.getColor(type);

                            return {
                                lineWidth: 1,
                                strokeStyle: converseHEXinotRGBA(colorHex, 1)
                            };
                        };

                        var createRelation = function() {
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

                            var toAnchors = function(relationId) {
                                return {
                                    sourceId: model.annotationData.relation.get(relationId).subj,
                                    targetId: model.annotationData.relation.get(relationId).obj
                                };
                            };

                            var determineCurviness = function(relationId) {
                                var anchors = toAnchors(relationId);
                                var sourcePosition = domPositionUtils.getEntity(anchors.sourceId);
                                var targetPosition = domPositionUtils.getEntity(anchors.targetId);

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

                            var create = function() {
                                var isGridPrepared = function(relationId) {
                                        var anchors = toAnchors(relationId);
                                        return gridPositionCache.isGridPrepared(anchors.sourceId) && gridPositionCache.isGridPrepared(anchors.targetId);
                                    },
                                    createJsPlumbConnect = function(relation, curviness) {
                                        // Make a connector by jsPlumb.
                                        return jsPlumbInstance.connect({
                                            source: domUtil.selector.entity.get(relation.subj),
                                            target: domUtil.selector.entity.get(relation.obj),
                                            anchors: ['TopCenter', "TopCenter"],
                                            connector: ['Bezier', curviness],
                                            paintStyle: getConnectorStrokeStyle(relation.id),
                                            parameters: {
                                                'id': relation.id,
                                            },
                                            cssClass: 'textae-editor__relation',
                                            overlays: [
                                                ['Arrow', normalArrow],
                                                ['Label', _.extend({}, label, {
                                                    label: '[' + relation.id + '] ' + relation.type,
                                                    cssClass: label.cssClass + ' ' + getModificationClasses(relation.id)
                                                })]
                                            ]
                                        });
                                    };

                                return function(relation) {
                                    // Create a relation as simlified version when before moving grids after creation grids.
                                    var beforeMoveGrid = !isGridPrepared(relation.id);
                                    var curviness = beforeMoveGrid ? {} : {
                                        curviness: determineCurviness(relation.id)
                                    };

                                    // Make a connector by jsPlumb.
                                    var connect = createJsPlumbConnect(relation, curviness);

                                    // Create as invisible to prevent flash at the initiation.
                                    if (beforeMoveGrid) {
                                        connect.setVisible(false);
                                    }

                                    return connect;
                                };
                            }();

                            var extend = function() {
                                // Extend module for jsPlumb.Connection.
                                var ExtendModule = function(relationId) {
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

                                            // Create as invisible to prevent flash at the initiation.
                                            if (!connect.isVisible()) {
                                                connect.setVisible(true);
                                            }
                                        },
                                        Pointupable = function(getStrokeStyle) {
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
                                                    connect.setPaintStyle(getStrokeStyle());
                                                },
                                                pointupLabel = function(connect) {
                                                    connect.getOverlay(label.id).addClass('hover');
                                                },
                                                pointdownLabel = function(connect) {
                                                    connect.getOverlay(label.id).removeClass('hover');
                                                },
                                                selectLabel = function(connect) {
                                                    connect.getOverlay('label').addClass('ui-selected');
                                                },
                                                deselectLabel = function(connect) {
                                                    connect.getOverlay('label').removeClass('ui-selected');
                                                },
                                                selectLine = function(connect) {
                                                    connect.addClass('ui-selected');
                                                },
                                                deselectLine = function(connect) {
                                                    connect.removeClass('ui-selected');
                                                };

                                            return {
                                                pointup: function() {
                                                    if (this.hasClass('ui-selected')) return;

                                                    pointupArrow(this);
                                                    pointupLabel(this);
                                                },
                                                pointdown: function() {
                                                    if (this.hasClass('ui-selected')) return;

                                                    pointdownAllow(this);
                                                    pointdownLabel(this);
                                                },
                                                select: function() {
                                                    pointupArrow(this);
                                                    pointdownLabel(this);
                                                    selectLabel(this);
                                                    selectLine(this);
                                                },
                                                deselect: function() {
                                                    pointdownAllow(this);
                                                    deselectLabel(this);
                                                    deselectLine(this);
                                                }
                                            };
                                        },
                                        bindClickAction = function(onClick) {
                                            this.bind('click', onClick);
                                            this.getOverlay(label.id).bind('click', function(label, event) {
                                                onClick(label.component, event);
                                            });
                                        };

                                    var getStrokeStyle = _.partial(getConnectorStrokeStyle, relationId);

                                    return _.extend({
                                        hasClass: function(className) {
                                            return this.connector.canvas.classList.contains(className);
                                        },
                                        // Set a function debounce to avoid over rendering.
                                        arrangePosition: _.debounce(_.partial(arrangePosition, relationId), 20),
                                        bindClickAction: bindClickAction
                                    }, new Pointupable(getStrokeStyle));
                                };

                                return function(connect) {
                                    var relationId = connect.getParameter('id');
                                    return _.extend(connect, new ExtendModule(relationId));
                                };
                            }();

                            // Set hover action.
                            var hoverize = function() {
                                var bindHoverAction = function(jsPlumbElement, onMouseOver, onMouseRemove) {
                                        jsPlumbElement.bind('mouseenter', onMouseOver).bind('mouseexit', onMouseRemove);
                                    },
                                    pointup = function(connect) {
                                        connect.pointup();
                                    },
                                    pointdown = function(connect) {
                                        connect.pointdown();
                                    },
                                    toComponent = function(label) {
                                        return label.component;
                                    };

                                return function(connect) {
                                    bindHoverAction(connect, pointup, pointdown);
                                    bindHoverAction(
                                        connect.getOverlay(label.id),
                                        _.compose(pointup, toComponent),
                                        _.compose(pointdown, toComponent)
                                    );
                                    return connect;
                                };
                            }();

                            // Cache a connect instance.
                            var cache = function(connect) {
                                var relationId = connect.getParameter('id');
                                cachedConnectors[relationId] = connect;
                                return connect;
                            };

                            // Notify to controller that a new jsPlumbConnection is added.
                            var notify = function(connect) {
                                editor.trigger('textae.editor.jsPlumbConnection.add', connect);
                                return connect;
                            };

                            return _.compose(notify, cache, hoverize, extend, create);
                        }();

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

                            labelOverlay.setLabel('[' + relation.id + '] ' + relation.type);
                            labelOverlay.removeClass('textae-editor__negation textae-editor__speculation');
                            labelOverlay.addClass(getModificationClasses(relation.id));

                            connector.setPaintStyle(getConnectorStrokeStyle(relation.id));
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
                            render: createRelation,
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
                    relation: relationRenderer
                };
            }();

            var modelToId = function(modelElement) {
                return modelElement.id;
            };

            var updateDisplayAfter = _.partial(_.compose, layoutManager.updateDisplay);

            var capitalize = function(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            };

            var renderModification = function(modelType, modification) {
                var target = model.annotationData[modelType].get(modification.obj);
                if (target) {
                    rendererImpl[modelType].change(target);
                    viewModel.buttonStateHelper['updateBy' + capitalize(modelType)]();
                }

                return modification;
            };
            var renderModificationOfEntity = _.partial(renderModification, 'entity');
            var renderModificationOfRelation = _.partial(renderModification, 'relation');
            var renderModificationEntityOrRelation = _.compose(renderModificationOfEntity, renderModificationOfRelation);

            return {
                setModelHandler: function() {
                    rendererImpl.init(getAnnotationArea());

                    model.annotationData
                        .bind('change-text', renderSourceDocument)
                        .bind('all.change', _.compose(model.selectionModel.clear, reset))
                        .bind('span.add', updateDisplayAfter(rendererImpl.span.render))
                        .bind('span.remove', updateDisplayAfter(rendererImpl.span.remove))
                        .bind('span.remove', _.compose(model.selectionModel.span.remove, modelToId))
                        .bind('entity.add', updateDisplayAfter(rendererImpl.entity.render))
                        .bind('entity.change', updateDisplayAfter(rendererImpl.entity.change))
                        .bind('entity.remove', updateDisplayAfter(rendererImpl.entity.remove))
                        .bind('entity.remove', _.compose(model.selectionModel.entity.remove, modelToId))
                        .bind('relation.add', rendererImpl.relation.render)
                        .bind('relation.change', rendererImpl.relation.change)
                        .bind('relation.remove', rendererImpl.relation.remove)
                        .bind('relation.remove', _.compose(model.selectionModel.relation.remove, modelToId))
                        .bind('modification.add', renderModificationEntityOrRelation)
                        .bind('modification.remove', renderModificationEntityOrRelation);
                }
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
            }
        };

        var hover = function() {
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
        }();

        var helper = function() {
            var changeLineHeight = function(heightValue) {
                    editor.find('.textae-editor__body__text-box').css({
                        'line-height': heightValue + 'px',
                        'margin-top': heightValue / 2 + 'px'
                    });
                },
                calculateLineHeight = function(heightOfType) {
                    var TEXT_HEIGHT = 23,
                        MARGIN_TOP = 6,
                        MINIMUM_HEIGHT = 16 * 4;
                    var maxHeight = _.max(model.annotationData.span.all()
                        .map(function(span) {
                            var height = TEXT_HEIGHT + MARGIN_TOP;
                            var countHeight = function(span) {
                                // Grid height is height of types and margin bottom of the grid.
                                height += span.getTypes().length * heightOfType + viewModel.viewMode.marginBottomOfGrid;
                                if (span.parent) {
                                    countHeight(span.parent);
                                }
                            };

                            countHeight(span);

                            return height;
                        }).concat(MINIMUM_HEIGHT)
                    );
                    changeLineHeight(maxHeight);
                };

            return {
                getLineHeight: function() {
                    return parseInt(editor.find('.textae-editor__body__text-box').css('line-height')) / 16;
                },
                changeLineHeight: changeLineHeight,
                calculateLineHeight: calculateLineHeight,
                changeTypeGap: function(typeGapValue) {
                    editor.find('.textae-editor__type').css({
                        height: 18 * typeGapValue + 18 + 'px',
                        'padding-top': 18 * typeGapValue + 'px'
                    });
                    layoutManager.updateDisplay();
                },
                redraw: layoutManager.updateDisplay
            };
        }();

        var setSelectionModelHandler = function() {
            var spanSelected = function(spanId) {
                    var $span = domUtil.selector.span.get(spanId);
                    selectionClass.addClass($span);
                },
                spanDeselected = function(spanId) {
                    var $span = domUtil.selector.span.get(spanId);
                    selectionClass.removeClass($span);
                },
                entitySelected = function(entityId) {
                    var $entity = domUtil.selector.entity.get(entityId);
                    selectionClass.addClass($entity);
                },
                entityDeselected = function(entityId) {
                    var $entity = domUtil.selector.entity.get(entityId);
                    selectionClass.removeClass($entity);
                },
                relationSelected = function(relationId) {
                    var addUiSelectClass = function(connector) {
                            if (connector) connector.select();
                        },
                        selectRelation = _.compose(addUiSelectClass, toConnector);

                    selectRelation(relationId);
                },
                relationDeselected = function(relationId) {
                    var removeUiSelectClass = function(connector) {
                            if (connector) connector.deselect();
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
            init: _.compose(setSelectionModelHandler, renderer.setModelHandler),
            renderer: renderer,
            viewModel: viewModel,
            domUtil: domUtil,
            hoverRelation: hover,
            helper: helper
        };
    };