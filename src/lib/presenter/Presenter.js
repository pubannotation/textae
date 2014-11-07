module.exports = function(editor, model, view, command, spanConfig) {
    var editorSelected = function() {
            userEvent.viewHandler.hideDialogs();

            // Select this editor.
            editor.eventEmitter.trigger('textae.editor.select');
            view.viewModel.buttonStateHelper.propagate();
        },
        typeEditor = require('./TypeEditor')(editor, model, spanConfig, command, view.viewModel, view.typeContainer),
        userEvent = function() {
            var editHandler = function() {
                    var toggleModification = function(modificationType) {
                        var isModificationType = function(modification) {
                                return modification.pred === modificationType;
                            },
                            getSpecificModification = function(id) {
                                return model.annotationData
                                    .getModificationOf(id)
                                    .filter(isModificationType);
                            },
                            commands,
                            has = view.viewModel.modeAccordingToButton[modificationType.toLowerCase()].value();

                        if (has) {
                            commands = typeEditor.getSelectedIdEditable().map(function(id) {
                                var modification = getSpecificModification(id)[0];
                                return command.factory.modificationRemoveCommand(modification.id);
                            });
                        } else {
                            commands = _.reject(typeEditor.getSelectedIdEditable(), function(id) {
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
                                        view.typeContainer.entity.getDefaultType(),
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
                                    type: view.typeContainer.entity.getDefaultType()
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
                            view.clipBoard.clipBoard = _.uniq(
                                function getEntitiesFromSelectedSpan() {
                                    return _.flatten(model.selectionModel.span.all().map(function(spanId) {
                                        return model.annotationData.span.get(spanId).getEntities();
                                    }));
                                }().concat(
                                    model.selectionModel.entity.all()
                                )
                            ).map(function(entityId) {
                                // Map entities to types, because entities may be delete.
                                return model.annotationData.entity.get(entityId).type;
                            });
                        },
                        pasteEntities: function() {
                            // Make commands per selected spans from types in clipBoard. 
                            var commands = _.flatten(model.selectionModel.span.all().map(function(spanId) {
                                return view.clipBoard.clipBoard.map(function(type) {
                                    return command.factory.entityCreateCommand({
                                        span: spanId,
                                        type: type
                                    });
                                });
                            }));

                            command.invoke(commands);
                        }
                    };
                }(),
                viewHandler = function() {
                    var editMode = require('./EditMode')(model, view.viewMode, typeEditor),
                        setViewMode = function(mode) {
                            if (editMode['to' + mode]) {
                                editMode['to' + mode]();
                            }
                        };

                    return {
                        showPallet: typeEditor.showPallet,
                        hideDialogs: typeEditor.hideDialogs,
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
                        showSettingDialog: require('./SettingDialog')(editor, editMode),
                        toggleRelationEditMode: function() {
                            // ビューモードを切り替える
                            if (view.viewModel.modeAccordingToButton['relation-edit-mode'].value()) {
                                editMode.toInstance();
                            } else {
                                editMode.toRelation();
                            }
                        },
                        bindChangeViewMode: function() {
                            var changeViewMode = function(prefix) {
                                editMode.init();

                                // Change view mode accoding to the annotation data.
                                if (model.annotationData.relation.some() || model.annotationData.span.multiEntities().length > 0) {
                                    setViewMode(prefix + 'Instance');
                                } else {
                                    setViewMode(prefix + 'Term');
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

            // Set cursor control by view rendering events.
            var cursorChanger = require('../util/CursorChanger')(editor);
            view
                .bind('render.start', function(editor) {
                    console.log(editor.editorId, 'render.start');
                    cursorChanger.startWait();
                })
                .bind('render.end', function(editor) {
                    console.log(editor.editorId, 'render.end');
                    cursorChanger.endWait();
                });
        },
        setMode: userEvent.viewHandler.bindChangeViewMode,
        event: {
            editorSelected: editorSelected,
            redraw: view.updateDisplay,
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
        }
    };
};