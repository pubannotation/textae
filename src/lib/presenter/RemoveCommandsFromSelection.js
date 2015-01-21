var toRomeveSpanCommands = function(spanIds, command) {
        return spanIds.map(command.factory.spanRemoveCommand);
    },
    toRemoveEntityCommands = function(entityIds, command) {
        return entityIds.map(function(entity) {
            // Wrap by a anonymous function, because command.factory.entityRemoveCommand has two optional arguments.
            return command.factory.entityRemoveCommand(entity);
        });
    },
    toRemoveRelationCommands = function(relationIds, command) {
        return relationIds.map(command.factory.relationRemoveCommand);
    },
    getAll = function(command, spanIds, entityIds, relationIds) {
        return []
            .concat(
                toRemoveRelationCommands(relationIds, command),
                toRemoveEntityCommands(entityIds, command),
                toRomeveSpanCommands(spanIds, command)
            );
    },
    RemoveCommandsFromSelection = function(command, selectionModel) {
        var spanIds = _.uniq(selectionModel.span.all()),
            entityIds = _.uniq(selectionModel.entity.all()),
            relationIds = _.uniq(selectionModel.relation.all());

        return getAll(command, spanIds, entityIds, relationIds);
    };


module.exports = RemoveCommandsFromSelection;
