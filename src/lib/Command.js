    // A command is an operation by user that is saved as history, and can undo and redo.
    // Users can edit model only via commands. 
    module.exports = function(idFactory, model, history, spanConfig) {
        var invoke = function(commands) {
            commands.forEach(function(command) {
                command.execute();
            });
        };

        var factory = function() {
            var debugLog = function(message, object) {
                    // For debug
                    if (object) {
                        console.log('[command.invoke]', message, object);
                    } else {
                        console.log('[command.invoke]', message);
                    }
                },
                updateSelection = function(modelType, selectOption, newModel) {
                    if (model.selectionModel[modelType]) {
                        var select = _.partial(model.selectionModel[modelType].add, newModel.id);
                        if (selectOption.delaySelect) {
                            _.delay(select, selectOption.delaySelect);
                        } else {
                            select();
                        }
                    }
                },
                createCommand = function(modelType, selectOption, newModel) {
                    return {
                        execute: function() {
                            // Update model
                            newModel = model.annotationData[modelType].add(newModel);

                            // Update Selection
                            if (selectOption) updateSelection(modelType, selectOption, newModel);

                            // Set revert
                            this.revert = _.partial(factory[modelType + 'RemoveCommand'], newModel.id);

                            debugLog('create a new ' + modelType + ': ', newModel);
                        }
                    };
                },
                removeCommand = function(modelType, id) {
                    return {
                        execute: function() {
                            var oloModel = model.annotationData[modelType].get(id);

                            // Update model
                            model.annotationData[modelType].remove(id);

                            // Set revert
                            this.revert = _.partial(createCommand, modelType, false, oloModel);

                            debugLog('remove a ' + modelType + ': ', oloModel);
                        },
                    };
                },
                changeTypeCommand = function(modelType, id, newType) {
                    return {
                        execute: function() {
                            var oldType = model.annotationData[modelType].get(id).type;

                            // Update model
                            var targetModel = model.annotationData[modelType].changeType(id, newType);

                            // Set revert
                            this.revert = _.partial(factory[modelType + 'ChangeTypeCommand'], id, oldType);

                            debugLog('change type of a ' + modelType + '. oldtype:' + oldType + ' ' + modelType + ':', targetModel);
                        }
                    };
                };

            return {
                spanCreateCommand: _.partial(createCommand, 'span', true),
                spanRemoveCommand: _.partial(removeCommand, 'span'),
                spanMoveCommand: function(spanId, begin, end) {
                    return {
                        execute: function() {
                            var commands = [];
                            var newSpanId = idFactory.makeSpanId(begin, end);

                            if (!model.annotationData.span.get(newSpanId)) {
                                commands.push(factory.spanRemoveCommand(spanId));
                                commands.push(factory.spanCreateCommand({
                                    begin: begin,
                                    end: end
                                }));
                                model.annotationData.span.get(spanId).getTypes().forEach(function(type) {
                                    type.entities.forEach(function(entityId) {
                                        commands.push(factory.entityCreateCommand({
                                            id: entityId,
                                            span: newSpanId,
                                            type: type.name
                                        }));
                                    });
                                });
                            }

                            commands.forEach(function(command) {
                                command.execute();
                            });

                            var oldBeginEnd = idFactory.parseSpanId(spanId);
                            this.revert = _.partial(factory.spanMoveCommand, newSpanId, oldBeginEnd.begin, oldBeginEnd.end);

                            debugLog('move a span, spanId:' + spanId + ', newBegin:' + begin + ', newEnd:' + end);
                        },
                    };
                },
                spanReplicateCommand: function(span) {
                    var RevertFunction = function(commands) {
                        var revert = function(command) {
                                return command.revert();
                            },
                            execute = function(command) {
                                command.execute();
                            },
                            command = {
                                execute: function() {
                                    commands
                                        .map(revert)
                                        .forEach(execute);

                                    debugLog('revert replicate a span, begin:' + span.begin + ', end:' + span.end);
                                }
                            };

                        return function() {
                            return command;
                        };
                    };

                    return {
                        execute: function() {
                            var commands = model
                                .getReplicationSpans(span, spanConfig)
                                .map(factory.spanCreateCommand);

                            commands.forEach(function(command) {
                                command.execute();
                            });

                            this.revert = new RevertFunction(commands);

                            debugLog('replicate a span, begin:' + span.begin + ', end:' + span.end);
                        }
                    };
                },
                entityCreateCommand: _.partial(createCommand, 'entity', true),
                entityRemoveCommand: _.partial(removeCommand, 'entity'),
                entityChangeTypeCommand: _.partial(changeTypeCommand, 'entity'),
                // The relaitonId is optional set only when revert of the relationRemoveCommand.
                // Set the css class lately, because jsPlumbConnector is no applyed that css class immediately after create.
                relationCreateCommand: _.partial(createCommand, 'relation', {
                    delaySelect: 100
                }),
                relationRemoveCommand: _.partial(removeCommand, 'relation'),
                relationChangeTypeCommand: _.partial(changeTypeCommand, 'relation'),
                modificationCreateCommand: _.partial(createCommand, 'modification', false),
                modificationRemoveCommand: _.partial(removeCommand, 'modification')
            };
        }();

        return {
            invoke: function(commands) {
                if (commands && commands.length > 0) {
                    invoke(commands);
                    history.push(commands);
                }
            },
            undo: function() {
                var RevertCommands = function(commands) {
                    commands = Object.create(commands);
                    commands.reverse();
                    return commands.map(function(originCommand) {
                        return originCommand.revert();
                    });
                };

                return function() {
                    if (history.hasAnythingToUndo()) {
                        model.selectionModel.clear();
                        var revertCommands = new RevertCommands(history.prev());
                        invoke(revertCommands);
                    }
                };
            }(),
            redo: function() {
                if (history.hasAnythingToRedo()) {
                    model.selectionModel.clear();
                    invoke(history.next());
                }
            },
            factory: factory
        };
    };