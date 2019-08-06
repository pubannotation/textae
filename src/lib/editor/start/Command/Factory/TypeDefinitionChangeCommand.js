import commandLog from './commandLog'
import ConfigurationCommand from './ConfigurationCommand'

export default class TypeDefinitionChangeCommand extends ConfigurationCommand {
  constructor(
    editor,
    annotationData,
    typeDefinition,
    modelType,
    oldType,
    changedProperties,
    revertDefaultTypeId
  ) {
    super()
    this.editor = editor
    this.annotationData = annotationData
    this.typeDefinition = typeDefinition
    this.modelType = modelType
    this.oldType = oldType
    this.changedProperties = changedProperties
    this.revertDefaultTypeId = revertDefaultTypeId
  }

  execute() {
    this.newType = Object.assign({}, this.oldType)
    this.revertChangedProperties = {}

    // change config
    Object.keys(this.changedProperties).forEach((key) => {
      if (
        this.changedProperties[key] === null &&
        typeof this.oldType[key] !== 'undefined'
      ) {
        delete this.newType[key]
        this.revertChangedProperties[key] = this.oldType[key]
      } else if (this.changedProperties[key] !== null) {
        this.newType[key] = this.changedProperties[key]
        this.revertChangedProperties[key] =
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

    commandLog(
      `change old type:${JSON.stringify(
        this.oldType
      )} to new type:${JSON.stringify(
        this.newType
      )}, default is \`${this.typeDefinition.getDefaultType()}\``
    )
  }

  revert() {
    return new TypeDefinitionChangeCommand(
      this.editor,
      this.annotationData,
      this.typeDefinition,
      this.modelType,
      this.newType,
      this.revertChangedProperties,
      this.revertDefaultTypeId
    )
  }
}
