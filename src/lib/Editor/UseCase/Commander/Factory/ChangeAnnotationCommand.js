import AnnotationCommand from './AnnotationCommand'
import commandLog from './commandLog'

export default class ChangeAnnotationCommand extends AnnotationCommand {
  #annotationDataModel
  #annotationType
  #id
  #newType

  constructor(annotationModel, annotationType, id, newType) {
    super()
    this.#annotationDataModel = annotationModel
    this.#annotationType = annotationType
    this.#id = id
    this.#newType = newType
  }

  execute() {
    this.oldType = this.#annotationDataModel
      .getInstanceContainerFor(this.#annotationType)
      .get(this.#id).typeName

    // Update instance
    const targetInstance = this.#annotationDataModel
      .getInstanceContainerFor(this.#annotationType)
      .changeType(this.#id, this.#newType)
    commandLog(
      this,
      `change type of a ${this.#annotationType}. old type:${this.oldType} ${this.#annotationType}:`,
      targetInstance
    )
  }

  revert() {
    return new ChangeAnnotationCommand(
      this.#annotationDataModel,
      this.#annotationType,
      this.#id,
      this.oldType
    )
  }
}
