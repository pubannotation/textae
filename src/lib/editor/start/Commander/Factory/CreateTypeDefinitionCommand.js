import commandLog from './commandLog'
import RemoveTypeDefinitionCommand from './RemoveTypeDefinitionCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class extends ConfigurationCommand {
  constructor(editor, typeDefinition, newType) {
    super()
    this.editor = editor
    this.typeDefinition = typeDefinition
    this.newType = newType
  }

  execute() {
    this.typeDefinition.addDefinedType(this.newType)

    // manage default type
    if (this.newType.default) {
      // remember the current default, because revert command will not understand what type was it.
      this.revertDefaultTypeId = this.typeDefinition.defaultType
      this.typeDefinition.defaultType = this.newType.id
    }

    commandLog(
      `create a new type:${JSON.stringify(this.newType)}, default is ${
        this.typeDefinition.defaultType
      }`
    )
  }

  revert() {
    return new RemoveTypeDefinitionCommand(
      this.editor,
      this.typeDefinition,
      this.newType,
      this.revertDefaultTypeId
    )
  }
}
