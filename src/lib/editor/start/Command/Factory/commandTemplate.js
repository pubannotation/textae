import BaseCommand from './BaseCommand'
import commandLog from './commandLog'

class CreateCommand extends BaseCommand {
  constructor(editor, annotationData, selectionModel, modelType, isSelectable, newModel) {
    super(function() {
      newModel = annotationData[modelType].add(newModel)

      if (isSelectable) {
        selectionModel.add(modelType, newModel.id)
      }

      // Set revert
      this.revert = () => new RemoveCommand(editor, annotationData, selectionModel, modelType, newModel.id)

      commandLog('create a new ' + modelType + ': ', newModel)

      return newModel
    })
  }
}

class RemoveCommand extends BaseCommand {
  constructor(editor, annotationData, selectionModel, modelType, id) {
    super(function() {
      // Update model
      let oloModel = annotationData[modelType].remove(id)

      if (oloModel) {
        // Set revert
        this.revert = () => new CreateCommand(editor, annotationData, selectionModel, modelType, false, oloModel)

        commandLog('remove a ' + modelType + ': ', oloModel)
      } else {
        // Do not revert unless an object was removed.
        this.revert = () => {
          return {
            execute: () => {}
          }
        }
        commandLog('already removed ' + modelType + ': ', id)
      }
    })
  }
}

export {
  CreateCommand,
  RemoveCommand
}
