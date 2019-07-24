import BaseCommand from './BaseCommand'
import commandLog from './commandLog'
import TypeDefinitionCreateCommand from './TypeDefinitionCreateCommand'

class TypeRemoveCommand extends BaseCommand {
  constructor(editor, typeDefinition, removeType, revertDefaultTypeId) {
    super(function() {
      let id = removeType.id,
        oldType = typeDefinition.getDefinedType(id)

      typeDefinition.remove(id)

      if (revertDefaultTypeId) {
        typeDefinition.setDefaultType(revertDefaultTypeId)
      }

      if (oldType) {
        removeType = oldType
      }

      // Set revert
      this.revert = () =>
        new TypeDefinitionCreateCommand(editor, typeDefinition, removeType)

      commandLog(
        'remove a type:' +
          JSON.stringify(removeType) +
          ', default is `' +
          typeDefinition.getDefaultType() +
          '`'
      )
    })
  }
}

export default TypeRemoveCommand
