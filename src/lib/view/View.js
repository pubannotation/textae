module.exports = function(editor, model) {
    var selector = require('./Selector')(editor, model);

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

        var reduce2hash = function(hash, element) {
            hash[element.name] = element;
            return hash;
        };

        var setContainerDefinedTypes = function(container, newDefinedTypes) {
            // expected newDefinedTypes is an array of object. example of object is {"name": "Regulation","color": "#FFFF66","default": true}.
            if (newDefinedTypes !== undefined) {
                container.setDefinedTypes(
                    newDefinedTypes
                    .map(function(type) {
                        return type;
                    })
                    .reduce(reduce2hash, {})
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
        var modeAccordingToButton = function(editor) {
            var Button = function(buttonName) {
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

            var buttons = [
                    'replicate-auto',
                    'relation-edit-mode',
                    'negation',
                    'speculation'
                ].map(Button),
                propagateStateOfAllButtons = function() {
                    buttons
                        .map(function(button) {
                            return button.propagate
                        })
                        .forEach(function(propagate) {
                            propagate();
                        });
                };

            // The public object.
            var api = buttons.reduce(reduce2hash, {});

            return _.extend(api, {
                propagate: propagateStateOfAllButtons
            });;
        }(editor);

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
                doPredicate = function(name) {
                    return _.isFunction(name) ? name() : s[name].some();
                },
                and = function() {
                    for (var i = 0; i < arguments.length; i++) {
                        if (!doPredicate(arguments[i])) return false;
                    }

                    return true;
                },
                or = function() {
                    for (var i = 0; i < arguments.length; i++) {
                        if (doPredicate(arguments[i])) return true;
                    }

                    return false;
                },
                hasCopy = function() {
                    return viewModel.clipBoard.length > 0;
                },
                sOrE = _.partial(or, 'span', 'entity'),
                eOrR = _.partial(or, 'entity', 'relation');


            // Check all associated anntation elements.
            // For exapmle, it should be that buttons associate with entitis is enable,
            // when deselect the span after select a span and an entity.
            var predicates = {
                replicate: s.span.single,
                entity: s.span.some,
                'delete': s.some, // It works well on relation-edit-mode if relations are deselect brefore an entity is select.
                copy: sOrE,
                paste: _.partial(and, hasCopy, 'span'),
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

        // Helper to update button state. 
        var buttonStateHelper = function() {
            var allButtons = ['delete'],
                spanButtons = allButtons.concat(['replicate', 'entity', 'copy', 'paste']),
                relationButtons = allButtons.concat(['pallet', 'change-label', 'negation', 'speculation']),
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
        }();

        return {
            // view.viewModel.clipBoard has entity id only.
            clipBoard: [],
            // Modes accoding to buttons of control.
            modeAccordingToButton: modeAccordingToButton,
            buttonStateHelper: buttonStateHelper,
            viewMode: function() {
                var changeCssClass = function(mode) {
                        editor
                            .removeClass('textae-editor_term-mode')
                            .removeClass('textae-editor_instance-mode')
                            .removeClass('textae-editor_relation-mode')
                            .addClass('textae-editor_' + mode + '-mode');
                    },
                    setControlButtonForRelation = function(isRelation) {
                        viewModel.buttonStateHelper.enabled('replicate-auto', !isRelation);
                        viewModel.modeAccordingToButton['relation-edit-mode'].value(isRelation);
                    },
                    // This notify is off at relation-edit-mode.
                    entitySelectChanged = _.compose(buttonStateHelper.updateByEntity, selector.entityLabel.update);

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
                        setControlButtonForRelation(false);

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
                        setControlButtonForRelation(false);

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
                        setControlButtonForRelation(true);

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

    // Render DOM elements conforming with the Model.
    var renderer = require('./Renderer')(editor, model, viewModel);

    // Management position of annotation components.
    var layoutManager = function(renderer) {
        var domPositionUtils = require('./DomPositionCache')(editor, model);

        var filterChanged = function(span, newPosition) {
            var oldGridPosition = domPositionUtils.getGrid(span.id);
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
                .map(domPositionUtils.toConnect)
            ).forEach(function(connect) {
                connect.arrangePosition();
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
                domPositionUtils.setGrid(span.id, newPosition);
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

        var updateDisplay = _.throttle(arrangePositionAll, 10);

        renderer.bind('change', updateDisplay);

        return {
            updateDisplay: updateDisplay
        };
    }(renderer);

    var domUtil = require('../util/DomUtil')(editor);

    var hover = function() {
        var domPositionUtils = require('./DomPositionCache')(editor, model);

        var processAccosiatedRelation = function(func, entityId) {
            model.annotationData.entity.assosicatedRelations(entityId)
                .map(domPositionUtils.toConnect)
                .forEach(func);
        };

        return {
            on: _.partial(processAccosiatedRelation, function(connect) {
                connect.pointup();
            }),
            off: _.partial(processAccosiatedRelation, function(connect) {
                connect.pointdown();
            })
        };
    }();

    var helper = function() {
        var changeLineHeight = function(heightValue) {
                editor.find('.textae-editor__body__text-box').css({
                    'line-height': heightValue + 'px',
                    'padding-top': heightValue / 2 + 'px'
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
        // The viewModel.buttonStateHelper.updateByEntity is set at viewMode.
        // Because entity.change is off at relation-edit-mode.
        model.selectionModel
            .bind('span.select', selector.span.select)
            .bind('span.deselect', selector.span.deselect)
            .bind('span.change', viewModel.buttonStateHelper.updateBySpan)
            .bind('entity.select', selector.entity.select)
            .bind('entity.deselect', selector.entity.deselect)
            .bind('relation.select', selector.relation.select)
            .bind('relation.deselect', selector.relation.deselect)
            .bind('relation.change', viewModel.buttonStateHelper.updateByRelation);
    };

    return {
        init: _.compose(setSelectionModelHandler, renderer.setModelHandler),
        viewModel: viewModel,
        domUtil: domUtil,
        hoverRelation: hover,
        helper: helper
    };
};