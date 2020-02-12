import commandLog from './commandLog'
import RemoveTypeDefinitionCommand from './RemoveTypeDefinitionCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class extends ConfigurationCommand {
  constructor(editor, typeContainer, newType) {
    super()
    this.editor = editor
    this.typeContainer = typeContainer
    this.newType = newType
  }

  execute() {
    this.typeContainer.addDefinedType(this.newType)

    // manage default type
    if (this.newType.default) {
      // remember the current default, because revert command will not understand what type was it.
      this.revertDefaultTypeId = this.typeContainer.defaultType
      this.typeContainer.defaultType = this.newType.id
    }

    commandLog(
      `create a new type:${JSON.stringify(this.newType)}, default is ${
        this.typeContainer.defaultType
      }`
    )
  }

  revert() {
    return new RemoveTypeDefinitionCommand(
      this.editor,
      this.typeContainer,
      this.newType,
      this.revertDefaultTypeId
    )
  }
}
