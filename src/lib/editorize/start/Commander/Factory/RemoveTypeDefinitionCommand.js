import commandLog from './commandLog'
import CreateTypeDefinitionCommand from './CreateTypeDefinitionCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class RemoveTypeDefinitionCommand extends ConfigurationCommand {
  constructor(definitionContainer, removeType, revertDefaultTypeId) {
    super()
    this._definitionContainer = definitionContainer
    this._removeType = removeType
    this._revertDefaultTypeId = revertDefaultTypeId
  }

  execute() {
    const { id } = this._removeType
    const oldType = this._definitionContainer.get(id)

    this._definitionContainer.delete(id, this._revertDefaultTypeId)

    if (oldType) {
      this._removeType = oldType
    }

    commandLog(
      `remove a type:${JSON.stringify(this._removeType)}, default is ${
        this._definitionContainer.defaultType
      }`
    )
  }

  revert() {
    return new CreateTypeDefinitionCommand(
      this._definitionContainer,
      this._removeType
    )
  }
}
