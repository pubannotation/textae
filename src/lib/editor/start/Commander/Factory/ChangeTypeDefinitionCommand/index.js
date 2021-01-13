import commandLog from '../commandLog'
import ConfigurationCommand from '../ConfigurationCommand'

export default class ChangeTypeDefinitionCommand extends ConfigurationCommand {
  constructor(
    editor,
    annotationData,
    typeContainer,
    configType,
    id,
    changedProperties,
    newDefaultTypeId
  ) {
    super()
    this._editor = editor
    this._annotationData = annotationData
    this._typeContainer = typeContainer
    this._configType = configType
    this._id = id
    this._changedProperties = changedProperties
    this._newDefaultTypeId = newDefaultTypeId
  }

  execute() {
    const oldType = this._typeContainer.get(this._id)
    const [newType, revertChangedProperties] = applyChangedProperties(
      this._changedProperties,
      oldType
    )
    this._typeContainer.set(this._id, newType)

    // manage default type
    this._updateDefaultType(newType)

    this.revertId = newType.id
    this.revertChangedProperties = revertChangedProperties

    commandLog(
      `change old type:${JSON.stringify(oldType)} to new type:${JSON.stringify(
        newType
      )}, default is ${this._typeContainer.defaultType}`
    )
  }

  _updateDefaultType(newType) {
    if (newType.default) {
      // remember the current default, because revert command will not understand what type was it.
      this.revertDefaultTypeId = this._typeContainer.defaultType
      this._typeContainer.defaultType = newType.id
    } else if (this._newDefaultTypeId) {
      this._typeContainer.defaultType = this._newDefaultTypeId
    }
  }

  revert() {
    return new ChangeTypeDefinitionCommand(
      this._editor,
      this._annotationData,
      this._typeContainer,
      this._configType,
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
