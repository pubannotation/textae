import BaseCommand from './BaseCommand'
import commandLog from './commandLog'
import TypeDefinitionRemoveCommand from './TypeDefinitionRemoveCommand'

class TypeCreateCommand extends BaseCommand {
  constructor(editor, typeDefinition, newType) {
    super(function() {
      Object.keys(newType).forEach((key) => {
        if (newType[key] === '' || (key === 'default' && !newType[key])) {
          delete newType[key]
        }
      })
      typeDefinition.setDefinedType(newType)

      // manage default type
      let revertDefaultTypeId
      if (newType.default) {
        // remember the current default, because revert command will not understand what type was it.
        revertDefaultTypeId = typeDefinition.getDefaultType()
        typeDefinition.setDefaultType(newType.id)
      }

      this.revert = () =>
        new TypeDefinitionRemoveCommand(
          editor,
          typeDefinition,
          newType,
          revertDefaultTypeId
        )

      commandLog(
        `create a new type:${JSON.stringify(
          newType
        )}, default is ${typeDefinition.getDefaultType()}`
      )
    })
  }
}

export default TypeCreateCommand
