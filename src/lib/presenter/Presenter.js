module.exports = function(editor, model, view, command, spanConfig) {
    // A Swithing point to change a behavior when relation is clicked.
    var jsPlumbConnectionClickedImpl = null;

    // A relation is drawn by a jsPlumbConnection.
    // The EventHandlar for clieck event of jsPlumbConnection. 
    var jsPlumbConnectionClicked = function() {
        return function(jsPlumbConnection, event) {
            // Check the event is processed already.
            // Because the jsPlumb will call the event handler twice
            // when a label is clicked that of a relation added after the initiation.
            if (jsPlumbConnectionClickedImpl && !event.processedByTextae) {
                jsPlumbConnectionClickedImpl(jsPlumbConnection, event);
            }

            event.processedByTextae = true;
        };
    }();

    var editorSelected = function() {
        userEvent.viewHandler.hideDialogs();

        // Select this editor.
        editor.tool.selectMe();
        view.viewModel.buttonStateHelper.propagate();
    };

    var userEvent = function() {
        // changeEventHandler will init.
        var changeTypeOfSelected,
            getSelectedAndEditableIds,
            editHandler = function() {
                var toggleModification = function() {

                    return function(modificationType) {
                        var isModificationType = function(modification) {
                                return modification.pred === modificationType;
                            },
                            getSpecificModification = function(id) {
                                return model.annotationData
                                    .getModificationOf(id)
                                    .filter(isModificationType);
                            };

                        var commands,
                            has = view.viewModel.modeAccordingToButton[modificationType.toLowerCase()].value();

                        if (has) {
                            commands = getSelectedIdEditable().map(function(id) {
                                var modification = getSpecificModification(id)[0];
                                return command.factory.modificationRemoveCommand(modification.id);
                            });
                        } else {
                            commands = _.reject(getSelectedIdEditable(), function(id) {
                                return getSpecificModification(id).length > 0;
                            }).map(function(id) {
                                return command.factory.modificationCreateCommand({
                                    obj: id,
                                    pred: modificationType
                                });
                            });
                        }

                        command.invoke(commands);
                    };
                }();

                return {
                    replicate: function() {
                        var spanId = model.selectionModel.span.single();
                        if (spanId) {
                            command.invoke(
                                [command.factory.spanReplicateCommand(
                                    view.viewModel.typeContainer.entity.getDefaultType(),
                                    model.annotationData.span.get(spanId)
                                )]
                            );
                        } else {
                            alert('You can replicate span annotation when there is only span selected.');
                        }
                    },
                    createEntity: function() {
                        var commands = model.selectionModel.span.all().map(function(spanId) {
                            return command.factory.entityCreateCommand({
                                span: spanId,
                                type: view.viewModel.typeContainer.entity.getDefaultType()
                            });
                        });

                        command.invoke(commands);
                    },
                    // set the type of an entity
                    setEntityType: function(newType) {
                        changeTypeOfSelected(newType);
                    },
                    newLabel: function() {
                        if (model.selectionModel.entity.some() || model.selectionModel.relation.some()) {
                            var newTypeLabel = prompt("Please enter a new label", "");
                            if (newTypeLabel) {
                                changeTypeOfSelected(newTypeLabel);
                            }
                        }
                    },
                    negation: _.partial(toggleModification, 'Negation'),
                    speculation: _.partial(toggleModification, 'Speculation'),
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

                        //remove spans
                        model.selectionModel.span.all().forEach(function(spanId) {
                            removeCommand.addSpanId(spanId);
                        });

                        //remove entities
                        model.selectionModel.entity.all().forEach(function(entityId) {
                            removeCommand.addEntityId(entityId);
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
                            // The view.viewModel.clipBoard has entityIds.
                            return view.viewModel.clipBoard.map(function(entityId) {
                                return command.factory.entityCreateCommand({
                                    span: spanId,
                                    type: model.annotationData.entity.get(entityId).type
                                });
                            });
                        }));

                        command.invoke(commands);
                    }
                };
            }(),
            viewHandler = function() {
                // The Reference to content to be shown in the pallet.
                var palletConfig = {};

                var dismissBrowserSelection = require('./dismissBrowserSelection');

                var eventHandlerComposer = function() {
                    var changeType = function(getSelectedAndEditableIds, createChangeTypeCommandFunction, newType) {
                            var ids = getSelectedAndEditableIds();
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
                                .off('mouseup', '.textae-editor__span_block')
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
                                                command.invoke([command.factory.relationCreateCommand({
                                                    subj: subjectEntityId,
                                                    obj: objectEntityId,
                                                    type: view.viewModel.typeContainer.relation.getDefaultType()
                                                })]);

                                                if (e.ctrlKey || e.metaKey) {
                                                    // Remaining selection of the subject entity.
                                                    model.selectionModel.entity.remove(objectEntityId);
                                                } else if (e.shiftKey) {
                                                    dismissBrowserSelection();
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
                                    return false;
                                },
                                // Select or deselect relation.
                                // This function is expected to be called when Relation-Edit-Mode.
                                selectRelation = function(jsPlumbConnection, event) {
                                    var relationId = jsPlumbConnection.getParameter("id");

                                    if (event.ctrlKey || event.metaKey) {
                                        model.selectionModel.relation.toggle(relationId);
                                    } else {
                                        // Select only self
                                        if (model.selectionModel.relation.single() !== relationId) {
                                            model.selectionModel.clear();
                                            model.selectionModel.relation.add(relationId);
                                        }
                                    }
                                },
                                returnFalse = function() {
                                    return false;
                                };

                            return function() {
                                // Control only entities and relations.
                                // Cancel events of relations and theier label.
                                // Because a jQuery event and a jsPlumb event are both fired when a relation are clicked.
                                // And jQuery events are propergated to body click events and cancel select.
                                // So multi selection of relations with Ctrl-key is not work. 
                                unbindAllEventhandler()
                                    .on('mouseup', '.textae-editor__entity', entityClickedAtRelationMode)
                                    .on('mouseup', '.textae-editor__relation, .textae-editor__relation__label', returnFalse)
                                    .on('mouseup', '.textae-editor__body', userEvent.viewHandler.cancelSelect);

                                palletConfig.typeContainer = view.viewModel.typeContainer.relation;
                                getSelectedIdEditable = model.selectionModel.relation.all;
                                changeTypeOfSelected = _.partial(changeType, getSelectedIdEditable, command.factory.relationChangeTypeCommand);

                                jsPlumbConnectionClickedImpl = selectRelation;
                            };
                        }(),
                        noRelationEdit: function() {
                            var selectEnd = require('./SelectEnd')(editor, model, spanConfig, command, view),
                                bodyClicked = function() {
                                    var selection = window.getSelection();

                                    // No select
                                    if (selection.isCollapsed) {
                                        userEvent.viewHandler.cancelSelect();
                                    } else {
                                        selectEnd.onText(selection);
                                    }
                                },
                                selectSpan = function(event) {
                                    var firstId = model.selectionModel.span.single();
                                    if (event.shiftKey && firstId) {
                                        //select reange of spans.
                                        var secondId = $(event.target).attr('id');
                                        model.selectionModel.clear();
                                        model.annotationData.span.range(firstId, secondId)
                                            .forEach(function(spanId) {
                                                model.selectionModel.span.add(spanId);
                                            });
                                    } else if (event.ctrlKey || event.metaKey) {
                                        model.selectionModel.span.toggle(event.target.id);
                                    } else {
                                        model.selectionModel.clear();
                                        model.selectionModel.span.add(event.target.id);
                                    }
                                },
                                spanClicked = function(event) {
                                    var selection = window.getSelection();

                                    // No select
                                    if (selection.isCollapsed) {
                                        selectSpan(event);
                                        return false;
                                    } else {
                                        selectEnd.onSpan(selection);
                                        // Cancel selection of a paragraph.
                                        // And do non propagate the parent span.
                                        event.stopPropagation();
                                    }
                                },
                                labelOrPaneClicked = function(ctrlKey, $typeLabel, $entities) {
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
                                },
                                typeLabelClicked = function(e) {
                                    var $typeLabel = $(e.target);
                                    return labelOrPaneClicked(e.ctrlKey || e.metaKey, $typeLabel, $typeLabel.next().children());
                                },
                                entityClicked = function(e) {
                                    var $target = $(e.target);
                                    if (e.ctrlKey || e.metaKey) {
                                        model.selectionModel.entity.toggle($target.attr('title'));
                                    } else {
                                        model.selectionModel.clear();
                                        model.selectionModel.entity.add($target.attr('title'));
                                    }
                                    return false;
                                },
                                entityPaneClicked = function(e) {
                                    var $typePane = $(e.target);
                                    return labelOrPaneClicked(e.ctrlKey || e.metaKey, $typePane.prev(), $typePane.children());
                                };

                            return function() {
                                unbindAllEventhandler()
                                    .on('mouseup', '.textae-editor__body', bodyClicked)
                                    .on('mouseup', '.textae-editor__span', spanClicked)
                                    .on('mouseup', '.textae-editor__type-label', typeLabelClicked)
                                    .on('mouseup', '.textae-editor__entity-pane', entityPaneClicked)
                                    .on('mouseup', '.textae-editor__entity', entityClicked);

                                palletConfig.typeContainer = view.viewModel.typeContainer.entity;
                                getSelectedIdEditable = model.selectionModel.entity.all;
                                changeTypeOfSelected = _.partial(changeType, getSelectedIdEditable, command.factory.entityChangeTypeCommand);

                                jsPlumbConnectionClickedImpl = null;
                            };
                        }(),
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
                        userEvent.viewHandler.hideDialogs();
                        model.selectionModel.clear();
                    };

                    var transition = {
                        toTerm: function() {
                            resetView();

                            eventHandlerComposer.noRelationEdit();
                            view.viewModel.viewMode.setTerm();
                            view.viewModel.viewMode.setEditable(true);

                            view.helper.redraw();

                            controllerState = state.termCentric;
                        },
                        toInstance: function() {
                            resetView();

                            eventHandlerComposer.noRelationEdit();
                            view.viewModel.viewMode.setInstance();
                            view.viewModel.viewMode.setEditable(true);

                            view.helper.redraw();

                            controllerState = state.instanceRelation;
                        },
                        toRelation: function() {
                            resetView();

                            eventHandlerComposer.relationEdit();
                            view.viewModel.viewMode.setRelation();
                            view.viewModel.viewMode.setEditable(true);

                            view.helper.redraw();

                            controllerState = state.relationEdit;
                        },
                        toViewTerm: function() {
                            resetView();

                            eventHandlerComposer.noEdit();
                            view.viewModel.viewMode.setTerm();
                            view.viewModel.viewMode.setEditable(false);

                            view.helper.redraw();

                            controllerState = state.viewTerm;
                        },
                        toViewInstance: function() {
                            resetView();

                            eventHandlerComposer.noEdit();
                            view.viewModel.viewMode.setInstance();
                            view.viewModel.viewMode.setEditable(false);

                            view.helper.redraw();

                            controllerState = state.viewInstance;
                        }
                    };

                    var notTransit = function() {
                        view.helper.redraw();
                    };
                    var state = {
                        termCentric: _.extend({}, transition, {
                            name: 'Term Centric',
                            toTerm: notTransit
                        }),
                        instanceRelation: _.extend({}, transition, {
                            name: 'Instance / Relation',
                            toInstance: notTransit,
                        }),
                        relationEdit: _.extend({}, transition, {
                            name: 'Relation Edit',
                            toRelation: notTransit
                        }),
                        viewTerm: _.extend({}, transition, {
                            name: 'View Only',
                            toTerm: notTransit,
                            toInstance: transition.toViewInstance,
                            toRelation: notTransit,
                            toViewTerm: notTransit
                        }),
                        viewInstance: _.extend({}, transition, {
                            name: 'View Only',
                            toTerm: transition.toViewTerm,
                            toInstance: notTransit,
                            toRelation: notTransit,
                            toViewInstance: notTransit
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

                var changeLineHeight = debounce300(_.compose(redrawAllEditor, view.helper.changeLineHeight, sixteenTimes));

                var changeTypeGap = debounce300(view.helper.changeTypeGap);

                var setViewMode = function(mode) {
                    if (controllerState['to' + mode]) {
                        controllerState['to' + mode]();
                    }
                };

                var pallet = require('../component/Pallet')();

                pallet
                    .bind('type.select', function(label) {
                        pallet.hide();
                        editHandler.setEntityType(label);
                    })
                    .bind('default-type.select', function(label) {
                        pallet.hide();
                        palletConfig.typeContainer.setDefaultType(label);
                    });

                return {
                    init: function() {
                        controllerState.init();
                    },
                    showPallet: function(point) {
                        pallet.show(palletConfig, point);
                    },
                    hidePallet: pallet.hide,
                    hideDialogs: function() {
                        viewHandler.hidePallet();
                        editor.tool.cancel();
                    },
                    redraw: function() {
                        view.helper.redraw();
                    },
                    cancelSelect: function() {
                        viewHandler.hideDialogs();
                        model.selectionModel.clear();
                        dismissBrowserSelection();
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
                                                    'value': view.helper.getLineHeight(),
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
                                    return require('../util/getDialog')(editor.editorId, 'textae.dialog.setting', 'Chage Settings', $content, true);
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
                    setViewMode: setViewMode,
                    bindChangeViewMode: function() {
                        var changeViewMode = function(prefix) {
                            // Change view mode accoding to the annotation data.
                            if (model.annotationData.relation.some() || model.annotationData.span.multiEntities().length > 0) {
                                setViewMode(prefix + 'Instance');
                                view.helper.calculateLineHeight(36);
                            } else {
                                setViewMode(prefix + 'Term');
                                view.helper.calculateLineHeight(18);
                            }
                        };

                        return function(mode) {
                            var prefix = mode === 'edit' ? '' : 'View';
                            model.annotationData.bind('all.change', _.partial(changeViewMode, prefix));
                        };
                    }()
                };
            }();

        return {
            // User event to edit model
            editHandler: editHandler,
            // User event that does not change data.
            viewHandler: viewHandler
        };
    }();

    return {
        jsPlumbConnectionAdded: function(event, jsPlumbConnection) {
            jsPlumbConnection.bindClickAction(jsPlumbConnectionClicked);
        },
        editorSelected: editorSelected,
        userEvent: userEvent
    };
};