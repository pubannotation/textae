import commandLog from './commandLog'
import AnnotationCommand from './AnnotationCommand'

class CreateCommand extends AnnotationCommand {
  constructor(annotationData, modelType, model, selectionModel = null) {
    super()
    this._annotationData = annotationData
    this._modelType = modelType
    this._model = model
    this._selectionModel = selectionModel
  }

  execute() {
    this._model = this._annotationData[this._modelType].add(this._model)

    if (this._selectionModel) {
      this._selectionModel.add(this._modelType, this._model.id)
    }

    commandLog(this, `${this._modelType}: ${this._model.id}`)
  }

  revert() {
    return new RemoveCommand(this._annotationData, this._modelType, this._model)
  }
}

class RemoveCommand extends AnnotationCommand {
  constructor(annotationData, modelType, model) {
    super()
    this._annotationData = annotationData
    this._modelType = modelType
    this._model = model
  }

  execute() {
    this._annotationData[this._modelType].remove(this._model.id)

    commandLog(this, `${this._modelType}: ${this._model.id}`)
  }

  revert() {
    return new CreateCommand(this._annotationData, this._modelType, this._model)
  }
}

export { CreateCommand, RemoveCommand }
