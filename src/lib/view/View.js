var delay150 = function(func) {
        return _.partial(_.delay, func, 150);
    },
    ButtonController = function(editor, model, clipBoard) {
        var reduce2hash = require('../util/reduce2hash');

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
                            return button.propagate;
                        })
                        .forEach(function(propagate) {
                            propagate();
                        });
                };

            // The public object.
            var api = buttons.reduce(reduce2hash, {});

            return _.extend(api, {
                propagate: propagateStateOfAllButtons
            });
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
                    return clipBoard.clipBoard.length > 0;
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
            // Modes accoding to buttons of control.
            modeAccordingToButton: modeAccordingToButton,
            buttonStateHelper: buttonStateHelper,
        };
    },
    ViewMode = function(editor, model, buttonController, renderFunc) {
        var selector = require('./Selector')(editor, model),
            changeCssClass = function(mode) {
                editor
                    .removeClass('textae-editor_term-mode')
                    .removeClass('textae-editor_instance-mode')
                    .removeClass('textae-editor_relation-mode')
                    .addClass('textae-editor_' + mode + '-mode');
            },
            setControlButtonForRelation = function(isRelation) {
                buttonController.buttonStateHelper.enabled('replicate-auto', !isRelation);
                buttonController.modeAccordingToButton['relation-edit-mode'].value(isRelation);
            },
            // This notify is off at relation-edit-mode.
            entitySelectChanged = _.compose(buttonController.buttonStateHelper.updateByEntity, selector.entityLabel.update),
            changeLineHeight = function(heightValue) {
                editor.find('.textae-editor__body__text-box').css({
                    'line-height': heightValue + 'px',
                    'padding-top': heightValue / 2 + 'px'
                });
            },
            calculateLineHeight = function(typeGapValue) {
                var TEXT_HEIGHT = 23,
                    MARGIN_TOP = 60,
                    MINIMUM_HEIGHT = 16 * 4,
                    heightOfType = typeGapValue * 18 + 18,
                    maxHeight = _.max(model.annotationData.span.all()
                        .map(function(span) {
                            var height = TEXT_HEIGHT + MARGIN_TOP;
                            var countHeight = function(span) {
                                // Grid height is height of types and margin bottom of the grid.
                                height += span.getTypes().length * heightOfType;
                                if (span.parent) {
                                    countHeight(span.parent);
                                }
                            };

                            countHeight(span);

                            return height;
                        }).concat(MINIMUM_HEIGHT)
                    );

                changeLineHeight(maxHeight);
            },
            typeGapValue = 0;

        var api = {
            getTypeGapValue: function() {
                return typeGapValue;
            },
            setTerm: function() {
                changeCssClass('term');
                setControlButtonForRelation(false);

                model.selectionModel
                    .unbind('entity.select', entitySelectChanged)
                    .unbind('entity.deselect', entitySelectChanged)
                    .unbind('entity.change', entitySelectChanged)
                    .bind('entity.select', entitySelectChanged)
                    .bind('entity.deselect', entitySelectChanged)
                    .bind('entity.change', buttonController.buttonStateHelper.updateByEntity);
            },
            setInstance: function() {
                changeCssClass('instance');
                setControlButtonForRelation(false);

                model.selectionModel
                    .unbind('entity.select', entitySelectChanged)
                    .unbind('entity.deselect', entitySelectChanged)
                    .unbind('entity.change', buttonController.buttonStateHelper.updateByEntity)
                    .bind('entity.select', entitySelectChanged)
                    .bind('entity.deselect', entitySelectChanged)
                    .bind('entity.change', buttonController.buttonStateHelper.updateByEntity);
            },
            setRelation: function() {
                changeCssClass('relation');
                setControlButtonForRelation(true);

                model.selectionModel
                    .unbind('entity.select', entitySelectChanged)
                    .unbind('entity.deselect', entitySelectChanged)
                    .unbind('entity.change', buttonController.buttonStateHelper.updateByEntity);
            },
            setEditable: function(isEditable) {
                if (isEditable) {
                    editor.addClass('textae-editor_editable');
                } else {
                    editor.removeClass('textae-editor_editable');
                    buttonController.buttonStateHelper.enabled('replicate-auto', false);
                    buttonController.buttonStateHelper.enabled('relation-edit-mode', false);
                }
            },
            getLineHeight: function() {
                return parseInt(editor.find('.textae-editor__body__text-box').css('line-height')) / 16;
            },
            changeLineHeight: changeLineHeight,
            changeTypeGap: function(newValue) {
                if (typeGapValue === newValue) return;

                // init
                if (newValue !== -1) {
                    editor.find('.textae-editor__type').css({
                        height: 18 * newValue + 18 + 'px',
                        'padding-top': 18 * newValue + 'px'
                    });
                    calculateLineHeight(newValue);
                    renderFunc(newValue);
                }

                typeGapValue = newValue;
            }
        };

        return api;
    };

module.exports = function(editor, model) {
    var selector = require('./Selector')(editor, model),
        clipBoard = {
            // clipBoard has entity type.
            clipBoard: []
        },
        buttonController = new ButtonController(editor, model, clipBoard),
        typeContainer = require('./TypeContainer')(model),
        // Render DOM elements conforming with the Model.
        renderer = require('./renderer/Renderer')(editor, model, buttonController, typeContainer),
        gridLayout = require('./GridLayout')(editor, model.annotationData),
        api = require('../util/extendBindable')({}),
        render = function(typeGapValue) {
            api.trigger('render.start', editor);
            // Do asynchronous to change behavior of editor.
            // For example a wait cursor or a disabled control.
            _.defer(function() {
                gridLayout.arrangePosition(typeGapValue)
                    .then(renderer.arrangeRelationPositionAll)
                    .then(renderer.renderLazyRelationAll)
                    .then(function() {
                        api.trigger('render.end', editor);
                    });
            });
        },
        viewMode = new ViewMode(editor, model, buttonController, render),
        hover = function() {
            var domPositionCaChe = require('./DomPositionCache')(editor, model.annotationData.entity),
                processAccosiatedRelation = function(func, entityId) {
                    model.annotationData.entity.assosicatedRelations(entityId)
                        .map(domPositionCaChe.toConnect)
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
        }(),
        setSelectionModelHandler = function() {
            // The buttonController.buttonStateHelper.updateByEntity is set at viewMode.
            // Because entity.change is off at relation-edit-mode.
            model.selectionModel
                .bind('span.select', selector.span.select)
                .bind('span.deselect', selector.span.deselect)
                .bind('span.change', buttonController.buttonStateHelper.updateBySpan)
                .bind('entity.select', selector.entity.select)
                .bind('entity.deselect', selector.entity.deselect)
                .bind('relation.select', delay150(selector.relation.select))
                .bind('relation.deselect', delay150(selector.relation.deselect))
                .bind('relation.change', buttonController.buttonStateHelper.updateByRelation);
        },
        updateDisplay = function() {
            console.log('updateDisplay');
            render(viewMode.getTypeGapValue());
        };

    renderer.bind('change', updateDisplay);

    return _.extend(api, {
        init: _.compose(setSelectionModelHandler, renderer.setModelHandler),
        viewModel: buttonController,
        clipBoard: clipBoard,
        viewMode: viewMode,
        hoverRelation: hover,
        updateDisplay: updateDisplay,
        typeContainer: typeContainer
    });
};