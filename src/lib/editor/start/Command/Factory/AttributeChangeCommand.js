import BaseCommand from './BaseCommand'
import commandLog from './commandLog'

export default class extends BaseCommand {
  constructor(annotationData, modelType, id, newType, newPred) {
    super(function() {
      let oldModel = annotationData[modelType].get(id)

      // Update model
      let targetModel = annotationData[modelType].change(id, newType, newPred)

      // Set revert
      this.revert = () => new AttributeChangeCommand(annotationData, modelType, id, oldModel.type, oldModel.pred)

      commandLog('change type of a ' + modelType
        + '. oldtype:' + oldModel.type + ' oldpred:' + oldModel.pred + ''
        + modelType + ':', targetModel)
    })
  }
}
