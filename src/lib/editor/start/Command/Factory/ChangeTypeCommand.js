import BaseCommand from './BaseCommand'
import commandLog from './commandLog'

class ChangeTypeCommand extends BaseCommand {
  constructor(editor, annotationData, modelType, id, newType) {
    super(function() {
      const oldType = annotationData[modelType].get(id).type

      // Update model
      const targetModel = annotationData[modelType].changeType(id, newType)

      // Set revert
      this.revert = () =>
        new ChangeTypeCommand(editor, annotationData, modelType, id, oldType)

      commandLog(
        `change type of a ${modelType}. oldtype:${oldType} ${modelType}:`,
        targetModel
      )
    })
  }
}

export default ChangeTypeCommand
