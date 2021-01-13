import commandLog from './commandLog'
import RemoveTypeDefinitionCommand from './RemoveTypeDefinitionCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class CreateTypeDefinitionCommand extends ConfigurationCommand {
  constructor(editor, typeContainer, newType) {
    super()
    this._editor = editor
    this._typeContainer = typeContainer
    this._newType = newType
  }

  execute() {
    // manage default type
    if (this._newType.default) {
      // remember the current default, because revert command will not understand what type was it.
      this._revertDefaultTypeId = this._typeContainer.defaultType
    }

    this._typeContainer.addDefinedType(this._newType)

    commandLog(
      `create a new type:${JSON.stringify(this._newType)}, default is ${
        this._typeContainer.defaultType
      }`
    )
  }

  revert() {
    return new RemoveTypeDefinitionCommand(
      this._editor,
      this._typeContainer,
      this._newType,
      this._revertDefaultTypeId
    )
  }
}
