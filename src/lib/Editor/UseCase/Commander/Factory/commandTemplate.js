import commandLog from './commandLog'
import AnnotationCommand from './AnnotationCommand'

class CreateCommand extends AnnotationCommand {
  constructor(
    annotationModel,
    annotationType,
    instance,
    selectionModel = null
  ) {
    super()
    this._annotationModel = annotationModel
    this._annotationType = annotationType
    this._instance = instance
    this._selectionModel = selectionModel
  }

  execute() {
    this._instance = this._annotationModel[this._annotationType].add(
      this._instance
    )

    if (this._selectionModel) {
      this._selectionModel.add(this._annotationType, [this._instance.id])
    }

    commandLog(this, `${this._annotationType}: ${this._instance.id}`)
  }

  revert() {
    return new RemoveCommand(
      this._annotationModel,
      this._annotationType,
      this._instance
    )
  }
}

class RemoveCommand extends AnnotationCommand {
  constructor(annotationModel, annotationType, instance) {
    super()
    this._annotationModel = annotationModel
    this._annotationType = annotationType
    this._instance = instance
  }

  execute() {
    this._annotationModel[this._annotationType].remove(this._instance.id)

    commandLog(this, `${this._annotationType}: ${this._instance.id}`)
  }

  revert() {
    return new CreateCommand(
      this._annotationModel,
      this._annotationType,
      this._instance
    )
  }
}

export { CreateCommand, RemoveCommand }
