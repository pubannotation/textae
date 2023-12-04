import commandLog from './commandLog'
import AnnotationCommand from './AnnotationCommand'

export default class ChangeAnnotationCommand extends AnnotationCommand {
  constructor(annotationModel, annotationType, id, newType) {
    super()
    this._annotationModel = annotationModel
    this._annotationType = annotationType
    this._id = id
    this._newType = newType
  }

  execute() {
    this.oldType = this._annotationModel[this._annotationType].get(
      this._id
    ).typeName

    // Update instance
    const targetInstance = this._annotationModel[
      this._annotationType
    ].changeType(this._id, this._newType)
    commandLog(
      this,
      `change type of a ${this._annotationType}. old type:${this.oldType} ${this._annotationType}:`,
      targetInstance
    )
  }

  revert() {
    return new ChangeAnnotationCommand(
      this._annotationModel,
      this._annotationType,
      this._id,
      this.oldType
    )
  }
}
