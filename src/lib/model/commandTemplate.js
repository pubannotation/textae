var updateSelection = function(model, modelType, newModel) {
        if (model.selectionModel[modelType]) {
            model.selectionModel[modelType].add(newModel.id);
        }
    },
    commandLog = require('./commandLog'),
    createCommandImpl = function(removeCommand, model, modelType, isSelectable, newModel) {
        return {
            execute: function() {
                // Update model
                newModel = model.annotationData[modelType].add(newModel);

                // Update Selection
                if (isSelectable) updateSelection(model, modelType, newModel);

                // Set revert
                this.revert = _.partial(removeCommand, _.noop, model, modelType, newModel.id);

                commandLog('create a new ' + modelType + ': ', newModel);

                return newModel;
            }
        };
    },
    removeCommandImpl = function(createCommand, model, modelType, id) {
        return {
            execute: function() {
                // Update model
                var oloModel = model.annotationData[modelType].remove(id);

                if (oloModel) {
                    // Set revert
                    this.revert = _.partial(createCommand, _.noop, model, modelType, false, oloModel);
                    commandLog('remove a ' + modelType + ': ', oloModel);
                } else {
                    // Do not revert unless an object was removed.
                    this.revert = function() {
                        return {
                            execute: function() {}
                        };
                    };
                    commandLog('already removed ' + modelType + ': ', id);
                }
            },
        };
    },
    createCommand = _.partial(createCommandImpl, removeCommandImpl),
    removeCommand = _.partial(removeCommandImpl, createCommandImpl),
    changeTypeCommand = function(model, modelType, id, newType) {
        return {
            execute: function() {
                var oldType = model.annotationData[modelType].get(id).type;

                // Update model
                var targetModel = model.annotationData[modelType].changeType(id, newType);

                // Set revert
                this.revert = _.partial(changeTypeCommand, model, modelType, id, oldType);

                commandLog('change type of a ' + modelType + '. oldtype:' + oldType + ' ' + modelType + ':', targetModel);
            }
        };
    },
    commandTemplate = {
        create: createCommand,
        remove: removeCommand,
        changeType: changeTypeCommand,
        debugLog: commandLog
    };

module.exports = commandTemplate;
