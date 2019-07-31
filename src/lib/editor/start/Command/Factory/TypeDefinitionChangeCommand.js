import BaseCommand from './BaseCommand'
import commandLog from './commandLog'

export default class TypeChangeCommand extends BaseCommand {
  constructor(
    editor,
    annotationData,
    typeDefinition,
    modelType,
    oldType,
    changeValues,
    revertDefaultTypeId
  ) {
    super()
    this.editor = editor
    this.annotationData = annotationData
    this.typeDefinition = typeDefinition
    this.modelType = modelType
    this.oldType = oldType
    this.changeValues = changeValues
    this.revertDefaultTypeId = revertDefaultTypeId
  }

  execute() {
    this.newType = Object.assign({}, this.oldType)
    this.revertChangeValues = {}

    // change config
    Object.keys(this.changeValues).forEach((key) => {
      if (
        this.changeValues[key] === null &&
        typeof this.oldType[key] !== 'undefined'
      ) {
        delete this.newType[key]
        this.revertChangeValues[key] = this.oldType[key]
      } else if (this.changeValues[key] !== null) {
        this.newType[key] = this.changeValues[key]
        this.revertChangeValues[key] =
          typeof this.oldType[key] === 'undefined' ? null : this.oldType[key]
      }
    })
    this.typeDefinition.changeDefinedType(this.oldType.id, this.newType)

    // manage default type
    if (this.newType.default) {
      // remember the current default, because revert command will not understand what type was it.
      this.revertDefaultTypeId = this.typeDefinition.getDefaultType()
      this.typeDefinition.setDefaultType(this.newType.id)
    } else if (this.revertDefaultTypeId) {
      this.typeDefinition.setDefaultType(this.revertDefaultTypeId)
      this.revertDefaultTypeId = 'undefined'
    }

    // change annotation
    this.annotationData[this.modelType].all().map((model) => {
      if (model.type === this.oldType.label || model.type === this.oldType.id) {
        this.annotationData[this.modelType].changeType(
          model.id,
          this.newType.id
        )
      }
    })

    commandLog(
      `change old type:${JSON.stringify(
        this.oldType
      )} to new type:${JSON.stringify(
        this.newType
      )}, default is \`${this.typeDefinition.getDefaultType()}\``
    )
  }

  revert() {
    return new TypeChangeCommand(
      this.editor,
      this.annotationData,
      this.typeDefinition,
      this.modelType,
      this.newType,
      this.revertChangeValues,
      this.revertDefaultTypeId
    )
  }
}
