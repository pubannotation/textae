import BaseCommand from './BaseCommand'
import commandLog from './commandLog'

class ChangeTypeCommand extends BaseCommand {
  constructor(editor, annotationData, modelType, id, newType) {
    super(function() {
      let oldType = annotationData[modelType].get(id).type

      // Update model
      let targetModel = annotationData[modelType].changeType(id, newType)

      // Set revert
      this.revert = () => new ChangeTypeCommand(editor, annotationData, modelType, id, oldType)

      commandLog('change type of a ' + modelType + '. oldtype:' + oldType + ' ' + modelType + ':', targetModel)
    })
  }
}

export default ChangeTypeCommand
