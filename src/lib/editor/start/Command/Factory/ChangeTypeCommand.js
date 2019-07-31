import BaseCommand from './BaseCommand'
import commandLog from './commandLog'

export default class ChangeTypeCommand extends BaseCommand {
  constructor(editor, annotationData, modelType, id, newType) {
    super()
    this.editor = editor
    this.annotationData = annotationData
    this.modelType = modelType
    this.id = id
    this.newType = newType
  }

  execute() {
    this.oldType = this.annotationData[this.modelType].get(this.id).type

    // Update model
    const targetModel = this.annotationData[this.modelType].changeType(
      this.id,
      this.newType
    )
    commandLog(
      `change type of a ${this.modelType}. oldtype:${this.oldType} ${this.modelType}:`,
      targetModel
    )
  }

  revert() {
    return new ChangeTypeCommand(
      this.editor,
      this.annotationData,
      this.modelType,
      this.id,
      this.oldType
    )
  }
}
