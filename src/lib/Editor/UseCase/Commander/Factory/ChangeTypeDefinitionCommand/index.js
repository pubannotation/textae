import commandLog from '../commandLog'
import ConfigurationCommand from '../ConfigurationCommand'
import applyChangedProperties from './applyChangedProperties'

export default class ChangeTypeDefinitionCommand extends ConfigurationCommand {
  constructor(
    annotationModel,
    definitionContainer,
    id,
    changedProperties,
    newDefaultTypeId
  ) {
    super()
    this._annotationModel = annotationModel
    this._definitionContainer = definitionContainer
    this._id = id
    this._changedProperties = changedProperties
    this._newDefaultTypeId = newDefaultTypeId
  }

  execute() {
    const oldType = this._definitionContainer.get(this._id)
    const [newType, revertChangedProperties] = applyChangedProperties(
      this._changedProperties,
      oldType
    )
    this._definitionContainer.replace(this._id, newType)

    if (newType.default) {
      // remember the current default, because revert command will not understand what type was it.
      this.revertDefaultTypeId = this._definitionContainer.defaultType
      this._definitionContainer.defaultType = newType.id
    } else if (this._newDefaultTypeId) {
      this._definitionContainer.defaultType = this._newDefaultTypeId
    }

    this.revertId = newType.id
    this.revertChangedProperties = revertChangedProperties

    commandLog(
      this,
      `change old type:${JSON.stringify(oldType)} to new type:${JSON.stringify(
        newType
      )}, default is ${this._definitionContainer.defaultType}`
    )
  }

  revert() {
    return new ChangeTypeDefinitionCommand(
      this._annotationModel,
      this._definitionContainer,
      this.revertId,
      this.revertChangedProperties,
      this.revertDefaultTypeId
    )
  }
}
