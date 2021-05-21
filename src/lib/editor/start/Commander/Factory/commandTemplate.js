import commandLog from './commandLog'
import AnnotationCommand from './AnnotationCommand'

class CreateCommand extends AnnotationCommand {
  constructor(
    editor,
    annotationData,
    modelType,
    newModel,
    selectionModel = null
  ) {
    super()
    this._editor = editor
    this._annotationData = annotationData
    this._modelType = modelType
    this._newModel = newModel
    this._selectionModel = selectionModel
  }

  execute() {
    this._newModel = this._annotationData[this._modelType].add(this._newModel)

    if (this._selectionModel) {
      this._selectionModel.add(this._modelType, this._newModel.id)
    }
    commandLog(`create a new ${this._modelType}: ${this._newModel.id}`)

    return this._newModel
  }

  revert() {
    return new RemoveCommand(
      this._editor,
      this._annotationData,
      this._modelType,
      this._newModel
    )
  }
}

class RemoveCommand extends AnnotationCommand {
  constructor(editor, annotationData, modelType, model) {
    super()
    this._editor = editor
    this._annotationData = annotationData
    this._modelType = modelType
    this._model = model
  }

  execute() {
    this._annotationData[this._modelType].remove(this._model.id)

    commandLog(`remove a ${this._modelType}: ${this._model.id}`)
  }

  revert() {
    if (this._model) {
      return new CreateCommand(
        this._editor,
        this._annotationData,
        this._modelType,
        this._model
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
