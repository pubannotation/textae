import AnnotationCommand from './AnnotationCommand'
import commandLog from './commandLog'

export default class ChangeAttributeCommand extends AnnotationCommand {
  constructor(annotationModel, attribute, newPred, newObj) {
    super()
    this._annotationModel = annotationModel
    this._attribute = attribute
    this._oldPred = attribute.pred
    this._oldObj = attribute.obj
    this._newPred = newPred
    this._newObj = newObj
  }

  execute() {
    this._newInstance = this._annotationModel.attribute.change(
      this._attribute.id,
      this._newPred,
      this._newObj
    )

    commandLog(
      this,
      `attribute: ${this._attribute.id} changed from ${this._oldPred}:${this._oldObj} to ${this._newInstance.pred}:${this._newInstance.obj}.`
    )
  }

  revert() {
    return new ChangeAttributeCommand(
      this._annotationModel,
      this._newInstance,
      this._oldPred,
      this._oldObj
    )
  }
}
