    // A command is an operation by user that is saved as history, and can undo and redo.
    // Users can edit model only via commands. 
    var Command = function(idFactory, model, history, spanConfig) {
        var invoke = function(commands) {
            commands.forEach(function(command) {
                command.execute();
            });
        };

        var factory = function() {
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

                            this.revert = _.partial(factory.spanRemoveCommand, newSpan.id);

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

                            this.revert = _.partial(factory.spanCreateCommand, {
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
                                commands.push(factory.spanRemoveCommand(spanId));
                                commands.push(factory.spanCreateCommand({
                                    begin: begin,
                                    end: end
                                }));
                                model.annotationData.span.get(spanId).getTypes().forEach(function(type) {
                                    type.entities.forEach(function(entityId) {
                                        commands.push(factory.entityCreateCommand(newSpanId, type.name, entityId));
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
                            var commands = model.getReplicationSpans(span, spanConfig)
                                .map(factory.spanCreateCommand);

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
                            this.revert = _.partial(factory.entityRemoveCommand, newEntity.id, spanId, typeName);

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

                            this.revert = _.partial(factory.entityCreateCommand, entity.span, entity.type, entityId);

                            debugLog('remove a entity, spanId:' + entity.span + ', type:' + entity.type + ', entityId:' + entityId);
                        },
                    };
                },
                entityChangeTypeCommand: function(entityId, newType) {
                    return {
                        execute: function() {
                            var oldType = model.annotationData.entity.get(entityId).type;

                            var changedEntity = model.annotationData.entity.changeType(entityId, newType);

                            this.revert = _.partial(factory.entityChangeTypeCommand, entityId, oldType);

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
                            this.revert = _.partial(factory.relationRemoveCommand, newRelation.id);

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

                            this.revert = _.partial(factory.relationCreateCommand, subject, object, predicate, relationId);

                            debugLog('remove a relation relationId:' + relationId + ', subject:' + subject + ', object:' + object + ', predicate:' + predicate);
                        }
                    };
                },
                relationChangePredicateCommand: function(relationId, predicate) {
                    return {
                        execute: function() {
                            var oldPredicate = model.annotationData.relation.get(relationId).pred;

                            model.annotationData.relation.changePredicate(relationId, predicate);

                            this.revert = _.partial(factory.relationChangePredicateCommand, relationId, oldPredicate);

                            debugLog('change predicate of relation, relationId:' + relationId + ', subject:' + model.annotationData.relation.get(relationId).subj + ', object:' + model.annotationData.relation.get(relationId).obj + ', predicate:' + oldPredicate + ', newPredicate:' + predicate);
                        }
                    };
                }
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
            factory: factory
        };
    };