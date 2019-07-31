import BaseCommand from './BaseCommand'
import commandLog from './commandLog'
import TypeDefinitionCreateCommand from './TypeDefinitionCreateCommand'

export default class TypeRemoveCommand extends BaseCommand {
  constructor(editor, typeDefinition, removeType, revertDefaultTypeId) {
    super()
    this.editor = editor
    this.typeDefinition = typeDefinition
    this.removeType = removeType
    this.revertDefaultTypeId = revertDefaultTypeId
  }

  execute() {
    const id = this.removeType.id
    const oldType = this.typeDefinition.getDefinedType(id)

    this.typeDefinition.remove(id)

    if (this.revertDefaultTypeId) {
      this.typeDefinition.setDefaultType(this.revertDefaultTypeId)
    }

    if (oldType) {
      this.removeType = oldType
    }

    commandLog(
      `remove a type:${JSON.stringify(
        this.removeType
      )}, default is \`${this.typeDefinition.getDefaultType()}\``
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
