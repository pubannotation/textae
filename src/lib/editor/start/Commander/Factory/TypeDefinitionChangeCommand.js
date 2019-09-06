import commandLog from './commandLog'
import ConfigurationCommand from './ConfigurationCommand'

export default class TypeDefinitionChangeCommand extends ConfigurationCommand {
  constructor(
    editor,
    annotationData,
    typeDefinition,
    modelType,
    id,
    changedProperties,
    newDefaultTypeId
  ) {
    super()
    this.editor = editor
    this.annotationData = annotationData
    this.typeDefinition = typeDefinition
    this.modelType = modelType
    this.id = id
    this.changedProperties = changedProperties
    this.newDefaultTypeId = newDefaultTypeId
  }

  execute() {
    const oldType = this.typeDefinition.get(this.id)
    const [newType, revertChangedProperties] = applyChangedProperties(
      this.changedProperties,
      oldType
    )
    this.typeDefinition.set(this.id, newType)

    // manage default type
    this._updateDefaultType(newType)

    this.revertId = newType.id
    this.revertChangedProperties = revertChangedProperties

    commandLog(
      `change old type:${JSON.stringify(oldType)} to new type:${JSON.stringify(
        newType
      )}, default is \`${this.typeDefinition.defaultType}\``
    )
  }

  _updateDefaultType(newType) {
    if (newType.default) {
      // remember the current default, because revert command will not understand what type was it.
      this.revertDefaultTypeId = this.typeDefinition.defaultType
      this.typeDefinition.defaultType = newType.id
    } else if (this.newDefaultTypeId) {
      this.typeDefinition.defaultType = this.newDefaultTypeId
    }
  }

  revert() {
    return new TypeDefinitionChangeCommand(
      this.editor,
      this.annotationData,
      this.typeDefinition,
      this.modelType,
      this.revertId,
      this.revertChangedProperties,
      this.revertDefaultTypeId
    )
  }
}

function applyChangedProperties(changedProperties, oldType) {
  const newType = Object.assign({}, oldType)
  const revertChangedProperties = new Map()
  // change config
  for (const [key, property] of changedProperties.entries()) {
    if (property === null && typeof oldType[key] !== 'undefined') {
      delete newType[key]
      revertChangedProperties.set(key, oldType[key])
    } else if (property !== null) {
      newType[key] = property
      revertChangedProperties.set(
        key,
        typeof oldType[key] === 'undefined' ? null : oldType[key]
      )
    }
  }
  return [newType, revertChangedProperties]
}
