import commandLog from './commandLog'
import TypeDefinitionCreateCommand from './TypeDefinitionCreateCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class TypeRemoveCommand extends ConfigurationCommand {
  constructor(editor, typeDefinition, removeType, revertDefaultTypeId) {
    super()
    this.editor = editor
    this.typeDefinition = typeDefinition
    this.removeType = removeType
    this.revertDefaultTypeId = revertDefaultTypeId
  }

  execute() {
    const id = this.removeType.id
    const oldType = this.typeDefinition.get(id)

    this.typeDefinition.delete(id)

    if (this.revertDefaultTypeId) {
      this.typeDefinition.defaultType = this.revertDefaultTypeId
    }

    if (oldType) {
      this.removeType = oldType
    }

    commandLog(
      `remove a type:${JSON.stringify(this.removeType)}, default is \`${
        this.typeDefinition.defaultType
      }\``
    )
  }

  revert() {
    return new TypeDefinitionCreateCommand(
      this.editor,
      this.typeDefinition,
      this.removeType
    )
  }
}
