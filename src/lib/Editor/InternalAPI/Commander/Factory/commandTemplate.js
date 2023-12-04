import commandLog from './commandLog'
import AnnotationCommand from './AnnotationCommand'

class CreateCommand extends AnnotationCommand {
  constructor(annotationData, instanceType, instance, selectionModel = null) {
    super()
    this._annotationData = annotationData
    this._instanceType = instanceType
    this._instance = instance
    this._selectionModel = selectionModel
  }

  execute() {
    this._instance = this._annotationData[this._instanceType].add(
      this._instance
    )

    if (this._selectionModel) {
      this._selectionModel.add(this._instanceType, this._instance.id)
    }

    commandLog(this, `${this._instanceType}: ${this._instance.id}`)
  }

  revert() {
    return new RemoveCommand(
      this._annotationData,
      this._instanceType,
      this._instance
    )
  }
}

class RemoveCommand extends AnnotationCommand {
  constructor(annotationData, instanceType, instance) {
    super()
    this._annotationData = annotationData
    this._instanceType = instanceType
    this._instance = instance
  }

  execute() {
    this._annotationData[this._instanceType].remove(this._instance.id)

    commandLog(this, `${this._instanceType}: ${this._instance.id}`)
  }

  revert() {
    return new CreateCommand(
      this._annotationData,
      this._instanceType,
      this._instance
    )
  }
}

export { CreateCommand, RemoveCommand }
