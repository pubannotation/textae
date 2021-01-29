import commandLog from './commandLog'
import AnnotationCommand from './AnnotationCommand'

class CreateCommand extends AnnotationCommand {
  constructor(
    editor,
    annotationData,
    modelType,
    newModel,
    selectionModel,
    isSelectable
  ) {
    super()
    this.editor = editor
    this.annotationData = annotationData
    this.selectionModel = selectionModel
    this.modelType = modelType
    this.isSelectable = isSelectable
    this.newModel = newModel
  }

  execute() {
    this.newModel = this.annotationData[this.modelType].add(this.newModel)

    if (this.isSelectable) {
      this.selectionModel.add(this.modelType, this.newModel.id)
    }
    commandLog(`create a new ${this.modelType}: ${this.newModel.id}`)

    return this.newModel
  }

  revert() {
    return new RemoveCommand(
      this.editor,
      this.annotationData,
      this.selectionModel,
      this.modelType,
      this.newModel.id
    )
  }
}

class RemoveCommand extends AnnotationCommand {
  constructor(editor, annotationData, selectionModel, modelType, id) {
    super()
    this.editor = editor
    this.annotationData = annotationData
    this.selectionModel = selectionModel
    this.modelType = modelType
    this.id = id
  }

  execute() {
    // Update model
    this.oloModel = this.annotationData[this.modelType].remove(this.id)

    if (this.oloModel) {
      commandLog(`remove a ${this.modelType}: `, this.oloModel)
    } else {
      commandLog(`already removed ${this.modelType}: `, this.id)
    }
  }

  revert() {
    if (this.oloModel) {
      return new CreateCommand(
        this.editor,
        this.annotationData,
        this.modelType,
        this.oloModel,
        this.selectionModel,
        false
      )
    } else {
      // Do not revert unless an object was removed.
      return {
        execute: () => {}
      }
    }
  }
}

export { CreateCommand, RemoveCommand }
