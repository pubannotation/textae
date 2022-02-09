import commandLog from './commandLog'
import AnnotationCommand from './AnnotationCommand'

export default class ChangeAnnotationCommand extends AnnotationCommand {
  constructor(annotationData, annotationType, id, newType) {
    super()
    this._annotationData = annotationData
    this._annotationType = annotationType
    this._id = id
    this._newType = newType
  }

  execute() {
    this.oldType = this._annotationData[this._annotationType].get(
      this._id
    ).typeName

    // Update model
    const targetModel = this._annotationData[this._annotationType].changeType(
      this._id,
      this._newType
    )
    commandLog(
      this,
      `change type of a ${this._annotationType}. oldtype:${this.oldType} ${this._annotationType}:`,
      targetModel
    )
  }

  revert() {
    return new ChangeAnnotationCommand(
      this._annotationData,
      this._annotationType,
      this._id,
      this.oldType
    )
  }
}
