import commandLog from './commandLog'
import TypeDefinitionRemoveCommand from './TypeDefinitionRemoveCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class TypeCreateCommand extends ConfigurationCommand {
  constructor(editor, typeDefinition, newType) {
    super()
    this.editor = editor
    this.typeDefinition = typeDefinition
    this.newType = newType
  }

  execute() {
    this.typeDefinition.setDefinedType(this.newType)

    // manage default type
    if (this.newType.default) {
      // remember the current default, because revert command will not understand what type was it.
      this.revertDefaultTypeId = this.typeDefinition.getDefaultType()
      this.typeDefinition.setDefaultType(this.newType.id)
    }

    commandLog(
      `create a new type:${JSON.stringify(
        this.newType
      )}, default is ${this.typeDefinition.getDefaultType()}`
    )
  }

  revert() {
    return new TypeDefinitionRemoveCommand(
      this.editor,
      this.typeDefinition,
      this.newType,
      this.revertDefaultTypeId
    )
  }
}
