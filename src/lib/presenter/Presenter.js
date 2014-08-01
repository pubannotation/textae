module.exports = function(editor, model, view, command, spanConfig) {
    var editorSelected = function() {
            userEvent.viewHandler.hideDialogs();

            // Select this editor.
            editor.tool.selectMe();
            view.viewModel.buttonStateHelper.propagate();
        },
        typeEditor = require('./TypeEditor')(editor, model, spanConfig, command, view.viewModel),
        userEvent = function() {
            var getSelectedAndEditableIds,
                editHandler = function() {
                    var toggleModification = function(modificationType) {
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
                        newLabel: function() {
                            if (model.selectionModel.entity.some() || model.selectionModel.relation.some()) {
                                var newTypeLabel = prompt("Please enter a new label", "");
                                if (newTypeLabel) {
                                    typeEditor.setNewType(newTypeLabel);
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
                    var controllerState = function() {
                        var resetView = function() {
                            userEvent.viewHandler.hideDialogs();
                            model.selectionModel.clear();
                        };

                        var transition = {
                            toTerm: function() {
                                resetView();

                                typeEditor.editEntity();
                                view.viewModel.viewMode.setTerm();
                                view.viewModel.viewMode.setEditable(true);

                                view.helper.redraw();

                                controllerState = state.termCentric;
                            },
                            toInstance: function() {
                                resetView();

                                typeEditor.editEntity();
                                view.viewModel.viewMode.setInstance();
                                view.viewModel.viewMode.setEditable(true);

                                view.helper.redraw();

                                controllerState = state.instanceRelation;
                            },
                            toRelation: function() {
                                resetView();

                                typeEditor.editRelation();
                                view.viewModel.viewMode.setRelation();
                                view.viewModel.viewMode.setEditable(true);

                                view.helper.redraw();

                                controllerState = state.relationEdit;
                            },
                            toViewTerm: function() {
                                resetView();

                                typeEditor.noEdit();
                                view.viewModel.viewMode.setTerm();
                                view.viewModel.viewMode.setEditable(false);

                                view.helper.redraw();

                                controllerState = state.viewTerm;
                            },
                            toViewInstance: function() {
                                resetView();

                                typeEditor.noEdit();
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

                    return {
                        init: function() {
                            controllerState.init();
                        },
                        showPallet: typeEditor.showPallet,
                        hideDialogs: typeEditor.hideDialogs,
                        redraw: function() {
                            view.helper.redraw();
                        },
                        cancelSelect: typeEditor.cancelSelect,
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
                                    view.helper.calculateLineHeight();
                                } else {
                                    setViewMode(prefix + 'Term');
                                    view.helper.calculateLineHeight();
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
        init: function() {
            // The jsPlumbConnetion has an original event mecanism.
            // We can only bind the connection directory.
            editor
                .on('textae.editor.jsPlumbConnection.add', function(event, jsPlumbConnection) {
                    jsPlumbConnection.bindClickAction(typeEditor.jsPlumbConnectionClicked);
                });

            userEvent.viewHandler.init();
        },
        bindChangeViewMode: userEvent.viewHandler.bindChangeViewMode,
        event: {
            editorSelected: editorSelected,
            redraw: userEvent.viewHandler.redraw,
            copyEntities: userEvent.editHandler.copyEntities,
            removeSelectedElements: userEvent.editHandler.removeSelectedElements,
            createEntity: userEvent.editHandler.createEntity,
            showPallet: userEvent.viewHandler.showPallet,
            replicate: userEvent.editHandler.replicate,
            pasteEntities: userEvent.editHandler.pasteEntities,
            newLabel: userEvent.editHandler.newLabel,
            cancelSelect: userEvent.viewHandler.cancelSelect,
            selectLeftSpan: userEvent.viewHandler.selectLeftSpan,
            selectRightSpan: userEvent.viewHandler.selectRightSpan,
            toggleRelationEditMode: userEvent.viewHandler.toggleRelationEditMode,
            negation: userEvent.editHandler.negation,
            speculation: userEvent.editHandler.speculation,
            showSettingDialog: userEvent.viewHandler.showSettingDialog
        },
        userEvent: userEvent
    };
};