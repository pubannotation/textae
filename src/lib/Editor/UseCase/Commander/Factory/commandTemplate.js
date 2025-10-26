import AnnotationCommand from './AnnotationCommand'
import commandLog from './commandLog'

class CreateCommand extends AnnotationCommand {
  #annotationModel
  #annotationType
  #instance
  #selectionModel

  constructor(
    annotationModel,
    annotationType,
    instance,
    selectionModel = null
  ) {
    super()
    this.#annotationModel = annotationModel
    this.#annotationType = annotationType
    this.#instance = instance
    this.#selectionModel = selectionModel
  }

  execute() {
    this.#instance = this.#annotationModel
      .getInstanceContainerFor(this.#annotationType)
      .add(this.#instance)

    if (this.#selectionModel) {
      this.#selectionModel.add(this.#annotationType, [this.#instance.id])
    }

    commandLog(this, `${this.#annotationType}: ${this.#instance.id}`)
  }

  revert() {
    return new RemoveCommand(
      this.#annotationModel,
      this.#annotationType,
      this.#instance
    )
  }
}

class RemoveCommand extends AnnotationCommand {
  #annotationModel
  #annotationType
  #instance

  constructor(annotationModel, annotationType, instance) {
    super()
    this.#annotationModel = annotationModel
    this.#annotationType = annotationType
    this.#instance = instance
  }

  execute() {
    this.#annotationModel
      .getInstanceContainerFor(this.#annotationType)
      .remove(this.#instance.id)

    commandLog(this, `${this.#annotationType}: ${this.#instance.id}`)
  }

  revert() {
    return new CreateCommand(
      this.#annotationModel,
      this.#annotationType,
      this.#instance
    )
  }
}

export { CreateCommand, RemoveCommand }
