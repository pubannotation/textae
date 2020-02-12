import commandLog from './commandLog'
import ConfigurationCommand from './ConfigurationCommand'

export default class ChangeTypeDefinitionCommand extends ConfigurationCommand {
  constructor(
    editor,
    annotationData,
    typeContainer,
    modelType,
    id,
    changedProperties,
    newDefaultTypeId
  ) {
    super()
    this.editor = editor
    this.annotationData = annotationData
    this.typeContainer = typeContainer
    this.modelType = modelType
    this.id = id
    this.changedProperties = changedProperties
    this.newDefaultTypeId = newDefaultTypeId
  }

  execute() {
    const oldType = this.typeContainer.get(this.id)
    const [newType, revertChangedProperties] = applyChangedProperties(
      this.changedProperties,
      oldType
    )
    this.typeContainer.set(this.id, newType)

    // manage default type
    this._updateDefaultType(newType)

    this.revertId = newType.id
    this.revertChangedProperties = revertChangedProperties

    commandLog(
      `change old type:${JSON.stringify(oldType)} to new type:${JSON.stringify(
        newType
      )}, default is ${this.typeContainer.defaultType}`
    )
  }

  _updateDefaultType(newType) {
    if (newType.default) {
      // remember the current default, because revert command will not understand what type was it.
      this.revertDefaultTypeId = this.typeContainer.defaultType
      this.typeContainer.defaultType = newType.id
    } else if (this.newDefaultTypeId) {
      this.typeContainer.defaultType = this.newDefaultTypeId
    }
  }

  revert() {
    return new ChangeTypeDefinitionCommand(
      this.editor,
      this.annotationData,
      this.typeContainer,
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
