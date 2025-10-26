import commandLog from './commandLog'
import ConfigurationCommand from './ConfigurationCommand'
import RemoveTypeDefinitionCommand from './RemoveTypeDefinitionCommand'

export default class CreateTypeDefinitionCommand extends ConfigurationCommand {
  constructor(definitionContainer, newType) {
    super()
    this._definitionContainer = definitionContainer
    this._newType = newType
  }

  execute() {
    // For UNDO, remember the default value before running this command.
    this._revertDefaultTypeId = this._definitionContainer._defaultType

    this._definitionContainer.addDefinedType(this._newType)

    commandLog(
      this,
      `create a new type:${JSON.stringify(this._newType)}, default is ${
        this._definitionContainer.defaultType
      }`
    )
  }

  revert() {
    return new RemoveTypeDefinitionCommand(
      this._definitionContainer,
      this._newType,
      this._revertDefaultTypeId
    )
  }
}
