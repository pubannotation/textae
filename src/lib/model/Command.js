var invoke = function(commands) {
        commands.forEach(function(command) {
            command.execute();
        });
    },
    executeSubCommands = function(subCommands) {
        subCommands.forEach(function(command) {
            command.execute();
        });
    },
    RevertCommands = function(commands) {
        commands = Object.create(commands);
        commands.reverse();
        return commands.map(function(originCommand) {
            return originCommand.revert();
        });
    },
    invokeRevert = _.compose(invoke, RevertCommands),
    debugLog = function(message, object) {
        // For debug
        if (object) {
            console.log('[command.invoke]', message, object);
        } else {
            console.log('[command.invoke]', message);
        }
    },
    setRevertAndLog = function() {
        var log = function(prefix, param) {
                debugLog(prefix + param.commandType + ' a ' + param.modelType + ': ' + param.id);
            },
            doneLog = _.partial(log, ''),
            revertLog = _.partial(log, 'revert '),
            RevertFunction = function(subCommands, logParam) {
                var toRevert = function(command) {
                        return command.revert();
                    },
                    execute = function(command) {
                        command.execute();
                    },
                    revertedCommand = {
                        execute: function() {
                            invokeRevert(subCommands);
                            revertLog(logParam);
                        }
                    };

                return function() {
                    return revertedCommand;
                };
            },
            setRevert = function(modelType, command, commandType, id, subCommands) {
                var logParam = {
                    modelType: modelType,
                    commandType: commandType,
                    id: id
                };

                command.revert = new RevertFunction(subCommands, logParam);
                return logParam;
            };

        return _.compose(doneLog, setRevert);
    }(),
    updateSelection = function(model, modelType, newModel) {
        if (model.selectionModel[modelType]) {
            model.selectionModel[modelType].add(newModel.id);
        }
    },
    getReplicationSpans = require('./getReplicationSpans');

// A command is an operation by user that is saved as history, and can undo and redo.
// Users can edit model only via commands. 
module.exports = function(editor, model, history) {
    var factory = function() {
        var idFactory = require('../util/IdFactory')(editor),
            createCommand = function(model, modelType, isSelectable, newModel) {
                return {
                    execute: function() {
                        // Update model
                        newModel = model.annotationData[modelType].add(newModel);

                        // Update Selection
                        if (isSelectable) updateSelection(model, modelType, newModel);

                        // Set revert
                        this.revert = _.partial(factory[modelType + 'RemoveCommand'], newModel.id);

                        debugLog('create a new ' + modelType + ': ', newModel);

                        return newModel;
                    }
                };
            },
            createCommandForModel = _.partial(createCommand, model),
            removeCommand = function(modelType, id) {
                return {
                    execute: function() {
                        // Update model
                        var oloModel = model.annotationData[modelType].remove(id);

                        if (oloModel) {
                            // Set revert
                            this.revert = _.partial(createCommandForModel, modelType, false, oloModel);
                            debugLog('remove a ' + modelType + ': ', oloModel);
                        } else {
                            // Do not revert unless an object was removed.
                            this.revert = function() {
                                return {
                                    execute: function() {}
                                };
                            };
                            debugLog('already removed ' + modelType + ': ', id);
                        }
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
            },
            setRevertAndLogSpan = _.partial(setRevertAndLog, 'span'),
            spanCreateCommand = _.partial(createCommandForModel, 'span', true),
            entityCreateCommand = _.partial(createCommandForModel, 'entity', true),
            spanAndDefaultEntryCreateCommand = function(type, span) {
                var id = idFactory.makeSpanId(span),
                    createSpan = spanCreateCommand(span),
                    createEntity = entityCreateCommand({
                        span: id,
                        type: type
                    }),
                    subCommands = [createSpan, createEntity];

                return {
                    execute: function() {
                        executeSubCommands(subCommands);
                        setRevertAndLogSpan(this, 'create', id, subCommands);
                    }
                };
            },
            spanReplicateCommand = function(type, span, detectBoundaryFunc) {
                var createSpan = _.partial(spanAndDefaultEntryCreateCommand, type),
                    subCommands = getReplicationSpans(model.annotationData, span, detectBoundaryFunc)
                    .map(createSpan);

                return {
                    execute: function() {
                        executeSubCommands(subCommands);
                        setRevertAndLogSpan(this, 'replicate', span.id, subCommands);
                    }
                };
            },
            // The relaitonId is optional set only when revert of the relationRemoveCommand.
            // Set the css class lately, because jsPlumbConnector is no applyed that css class immediately after create.
            relationCreateCommand = _.partial(createCommandForModel, 'relation', false),
            relationCreateAndSelectCommand = _.partial(createCommandForModel, 'relation', true),
            modificationRemoveCommand = _.partial(removeCommand, 'modification'),
            relationRemoveCommand = _.partial(removeCommand, 'relation'),
            relationAndAssociatesRemoveCommand = function(id) {
                var removeRelation = relationRemoveCommand(id),
                    removeModification = model.annotationData.getModificationOf(id)
                    .map(function(modification) {
                        return modification.id;
                    })
                    .map(modificationRemoveCommand),
                    subCommands = removeModification.concat(removeRelation);

                return {
                    execute: function() {
                        executeSubCommands(subCommands);
                        setRevertAndLog('relation', this, 'remove', id, subCommands);
                    }
                };

            },
            entityRemoveCommand = _.partial(removeCommand, 'entity'),
            entityAndAssociatesRemoveCommand = function(id) {
                var removeEntity = entityRemoveCommand(id),
                    removeRelation = model.annotationData.entity.assosicatedRelations(id)
                    .map(relationRemoveCommand),
                    removeModification = model.annotationData.getModificationOf(id)
                    .map(function(modification) {
                        return modification.id;
                    })
                    .map(modificationRemoveCommand),
                    subCommands = removeRelation.concat(removeModification).concat(removeEntity);

                return {
                    execute: function() {
                        executeSubCommands(subCommands);
                        setRevertAndLog('entity', this, 'remove', id, subCommands);
                    }
                };
            },
            spanRemoveCommand = function(id) {
                var removeSpan = _.partial(removeCommand, 'span')(id),
                    removeEntity = _.flatten(model.annotationData.span.get(id).getTypes().map(function(type) {
                        return type.entities.map(function(entityId) {
                            return entityAndAssociatesRemoveCommand(entityId);
                        });
                    })),
                    subCommands = removeEntity.concat(removeSpan);

                return {
                    execute: function() {
                        executeSubCommands(subCommands);
                        setRevertAndLogSpan(this, 'remove', id, subCommands);
                    }
                };
            },
            entityRemoveAndSpanRemeveIfNoEntityRestCommand = function(id) {
                var span = model.annotationData.span.get(model.annotationData.entity.get(id).span),
                    numberOfRestEntities = _.reject(
                        _.flatten(
                            span.getTypes()
                            .map(function(type) {
                                return type.entities;
                            })
                        ),
                        function(entityId) {
                            return entityId === id;
                        }
                    ).length;

                return numberOfRestEntities === 0 ?
                    spanRemoveCommand(span.id) :
                    entityAndAssociatesRemoveCommand(id);
            },
            entityChangeTypeCommand = _.partial(changeTypeCommand, 'entity'),
            entityChangeTypeRemoveRelationCommand = function(id, newType, isRemoveRelations) {
                var changeType = _.partial(changeTypeCommand, 'entity')(id, newType),
                    subCommands = isRemoveRelations ?
                    model.annotationData.entity.assosicatedRelations(id)
                    .map(relationRemoveCommand)
                    .concat(changeType) :
                    [changeType];

                return {
                    execute: function() {
                        executeSubCommands(subCommands);
                        setRevertAndLog('entity', this, 'change', id, subCommands);
                    }
                };
            },
            spanMoveCommand = function(spanId, newSpan) {
                var subCommands = [],
                    newSpanId = idFactory.makeSpanId(newSpan),
                    d = model.annotationData;

                if (!d.span.get(newSpanId)) {
                    subCommands.push(spanRemoveCommand(spanId));
                    subCommands.push(spanCreateCommand({
                        begin: newSpan.begin,
                        end: newSpan.end
                    }));
                    d.span.get(spanId).getTypes().forEach(function(type) {
                        type.entities.forEach(function(id) {
                            subCommands.push(entityCreateCommand({
                                id: id,
                                span: newSpanId,
                                type: type.name
                            }));

                            subCommands = subCommands.concat(
                                d.entity.assosicatedRelations(id)
                                .map(d.relation.get)
                                .map(relationCreateCommand)
                            );
                        });
                    });
                }

                return {
                    execute: function() {
                        executeSubCommands(subCommands);
                        setRevertAndLog('span', this, 'move', spanId, subCommands);
                    }
                };
            };

        return {
            spanCreateCommand: spanAndDefaultEntryCreateCommand,
            spanRemoveCommand: spanRemoveCommand,
            spanMoveCommand: spanMoveCommand,
            spanReplicateCommand: spanReplicateCommand,
            entityCreateCommand: entityCreateCommand,
            entityRemoveCommand: entityRemoveAndSpanRemeveIfNoEntityRestCommand,
            entityChangeTypeCommand: entityChangeTypeRemoveRelationCommand,
            relationCreateCommand: relationCreateAndSelectCommand,
            relationRemoveCommand: relationAndAssociatesRemoveCommand,
            relationChangeTypeCommand: _.partial(changeTypeCommand, 'relation'),
            modificationCreateCommand: _.partial(createCommandForModel, 'modification', false),
            modificationRemoveCommand: modificationRemoveCommand
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
            return function() {
                if (history.hasAnythingToUndo()) {
                    model.selectionModel.clear();
                    invokeRevert(history.prev());
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