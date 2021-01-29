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
    this._editor = editor
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._modelType = modelType
    this._isSelectable = isSelectable
    this._newModel = newModel
  }

  execute() {
    this._newModel = this._annotationData[this._modelType].add(this._newModel)

    if (this._isSelectable) {
      this._selectionModel.add(this._modelType, this._newModel.id)
    }
    commandLog(`create a new ${this._modelType}: ${this._newModel.id}`)

    return this._newModel
  }

  revert() {
    return new RemoveCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      this._modelType,
      this._newModel.id
    )
  }
}

class RemoveCommand extends AnnotationCommand {
  constructor(editor, annotationData, selectionModel, modelType, id) {
    super()
    this._editor = editor
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._modelType = modelType
    this._id = id
  }

  execute() {
    // Update model
    this.oloModel = this._annotationData[this._modelType].remove(this._id)

    if (this.oloModel) {
      commandLog(`remove a ${this._modelType}: `, this.oloModel)
    } else {
      commandLog(`already removed ${this._modelType}: `, this._id)
    }
  }

  revert() {
    if (this.oloModel) {
      return new CreateCommand(
        this._editor,
        this._annotationData,
        this._modelType,
        this.oloModel,
        this._selectionModel,
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
