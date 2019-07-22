import BaseCommand from './BaseCommand'
import commandLog from './commandLog'
import AttributeChangeCommand from './AttributeChangeCommand'

export default class extends BaseCommand {
  constructor(annotationData, id, newPred, newObj) {
    super(function() {
      const oldModel = Object.assign(annotationData.attribute.get(id))

      // Update model
      const targetModel = annotationData.attribute.change(id, newPred, newObj)

      // Set revert
      this.revert = () => new AttributeChangeCommand(annotationData, 'attribute', id, oldModel.pred, oldModel.obj)

      commandLog(`change type of an attribute old pred:${oldModel.pred} old obj:${oldModel.obj}. attribute:`, targetModel)
    })
  }
}
