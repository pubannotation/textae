import commandLog from './commandLog'
import CreateTypeDefinitionCommand from './CreateTypeDefinitionCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class RemoveTypeDefinitionCommand extends ConfigurationCommand {
  constructor(editor, typeContainer, removeType, revertDefaultTypeId) {
    super()
    this._editor = editor
    this._typeContainer = typeContainer
    this._removeType = removeType
    this._revertDefaultTypeId = revertDefaultTypeId
  }

  execute() {
    const { id } = this._removeType
    const oldType = this._typeContainer.get(id)

    this._typeContainer.delete(id)

    if (this._revertDefaultTypeId) {
      this._typeContainer.defaultType = this._revertDefaultTypeId
    }

    if (oldType) {
      this._removeType = oldType
    }

    commandLog(
      `remove a type:${JSON.stringify(this._removeType)}, default is ${
        this._typeContainer.defaultType
      }`
    )
  }

  revert() {
    return new CreateTypeDefinitionCommand(
      this._editor,
      this._typeContainer,
      this._removeType
    )
  }
}
