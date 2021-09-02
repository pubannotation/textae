import commandLog from './commandLog'
import RemoveTypeDefinitionCommand from './RemoveTypeDefinitionCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class CreateTypeDefinitionCommand extends ConfigurationCommand {
  constructor(editor, definitionContainer, newType) {
    super()
    this._editor = editor
    this._definitionContainer = definitionContainer
    this._newType = newType
  }

  execute() {
    // manage default type
    if (this._newType.default) {
      // remember the current default, because revert command will not understand what type was it.
      this._revertDefaultTypeId = this._definitionContainer.defaultType
    }

    this._definitionContainer.addDefinedType(this._newType)

    commandLog(
      `create a new type:${JSON.stringify(this._newType)}, default is ${
        this._definitionContainer.defaultType
      }`
    )
  }

  revert() {
    return new RemoveTypeDefinitionCommand(
      this._editor,
      this._definitionContainer,
      this._newType,
      this._revertDefaultTypeId
    )
  }
}
