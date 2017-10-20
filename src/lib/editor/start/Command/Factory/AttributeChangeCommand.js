import BaseCommand from './BaseCommand'
import commandLog from './commandLog'
import AttributeChangeCommand from './AttributeChangeCommand'

export default class extends BaseCommand {
  constructor(annotationData, modelType, id, newPred, newValue) {
    super(function() {
      let oldModel = annotationData[modelType].get(id)

      // Update model
      let targetModel = annotationData[modelType].change(id, newPred, newValue)

      // Set revert
      this.revert = () => new AttributeChangeCommand(annotationData, modelType, id, oldModel.pred, oldModel.value)

      commandLog('change type of a ' + modelType
        + ' old pred:' + oldModel.pred + ' old value:' + oldModel.type + '. '
        + modelType + ':', targetModel)
    })
  }
}
