import commandLog from './commandLog'
import AnnotationCommand from './AnnotationCommand'

export default class ChangeTypeCommand extends AnnotationCommand {
  constructor(editor, annotationData, modelType, id, newType) {
    super()
    this._editor = editor
    this._annotationData = annotationData
    this._modelType = modelType
    this._id = id
    this._newType = newType
  }

  execute() {
    this.oldType = this._annotationData[this._modelType].get(this._id).typeName

    // Update model
    const targetModel = this._annotationData[this._modelType].changeType(
      this._id,
      this._newType
    )
    commandLog(
      `change type of a ${this._modelType}. oldtype:${this.oldType} ${this._modelType}:`,
      targetModel
    )
  }

  revert() {
    return new ChangeTypeCommand(
      this._editor,
      this._annotationData,
      this._modelType,
      this._id,
      this.oldType
    )
  }
}
