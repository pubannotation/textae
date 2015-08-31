import commandLog from './commandLog'

class Command {
  constructor(execute) {
    this.execute = execute
  }
  execute() {}
  revert() {}
}

class CreateCommand extends Command {
  constructor(model, modelType, isSelectable, newModel) {
    super(function() {
      newModel = model.annotationData[modelType].add(newModel)

      if (isSelectable)
        selectNewModel(model.selectionModel, modelType, newModel)

      // Set revert
      this.revert = () => new RemoveCommand(model, modelType, newModel.id)

      commandLog('create a new ' + modelType + ': ', newModel)

      return newModel
    })
  }
}

class RemoveCommand extends Command {
  constructor(model, modelType, id) {
    super(function() {
      // Update model
      let oloModel = model.annotationData[modelType].remove(id)

      if (oloModel) {
        // Set revert
        this.revert = () => new CreateCommand(model, modelType, false, oloModel)

        commandLog('remove a ' + modelType + ': ', oloModel)
      } else {
        // Do not revert unless an object was removed.
        this.revert = function() {
          return {
            execute: function() {}
          }
        }
        commandLog('already removed ' + modelType + ': ', id)
      }
    })
  }
}

class ChangeTypeCommand extends Command {
  constructor(model, modelType, id, newType) {
    super(function() {
      let oldType = model.annotationData[modelType].get(id).type

      // Update model
      let targetModel = model.annotationData[modelType].changeType(id, newType)

      // Set revert
      this.revert = () => new ChangeTypeCommand(model, modelType, id, oldType)

      commandLog('change type of a ' + modelType + '. oldtype:' + oldType + ' ' + modelType + ':', targetModel)
    })
  }
}

let debugLog = commandLog

export {
  debugLog,
  CreateCommand,
  RemoveCommand,
  ChangeTypeCommand
}

function selectNewModel(selectionModel, modelType, newModel) {
  if (selectionModel[modelType]) {
    selectionModel[modelType].add(newModel.id)
  }
}
