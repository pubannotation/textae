import commandLog from '../commandLog'
import ConfigurationCommand from '../ConfigurationCommand'
import applyChangedProperties from './applyChangedProperties'

export default class ChangeTypeDefinitionCommand extends ConfigurationCommand {
  constructor(
    editor,
    annotationData,
    typeContainer,
    id,
    changedProperties,
    newDefaultTypeId
  ) {
    super()
    this._editor = editor
    this._annotationData = annotationData
    this._typeContainer = typeContainer
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
    this._typeContainer.replace(this._id, newType)

    if (newType.default) {
      // remember the current default, because revert command will not understand what type was it.
      this.revertDefaultTypeId = this._typeContainer.defaultType
      this._typeContainer.defaultType = newType.id
    } else if (this._newDefaultTypeId) {
      this._typeContainer.defaultType = this._newDefaultTypeId
    }

    this.revertId = newType.id
    this.revertChangedProperties = revertChangedProperties

    commandLog(
      `change old type:${JSON.stringify(oldType)} to new type:${JSON.stringify(
        newType
      )}, default is ${this._typeContainer.defaultType}`
    )
  }

  revert() {
    return new ChangeTypeDefinitionCommand(
      this._editor,
      this._annotationData,
      this._typeContainer,
      this.revertId,
      this.revertChangedProperties,
      this.revertDefaultTypeId
    )
  }
}
