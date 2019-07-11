import BaseCommand from './BaseCommand'
import commandLog from './commandLog'
import TypeDefinitionRemoveCommand from './TypeDefinitionRemoveCommand'

class TypeCreateCommand extends BaseCommand {
  constructor(editor, typeContainer, newType) {
    super(function() {
      Object.keys(newType).forEach((key) => {
        if (newType[key] === '' || key === 'default' && !newType[key]) {
          delete newType[key]
        }
      })
      typeContainer.setDefinedType(newType)

      // manage default type
      let revertDefaultTypeId
      if (newType.default) {
        // remember the current default, because revert command will not understand what type was it.
        revertDefaultTypeId = typeContainer.getDefaultType()
        typeContainer.setDefaultType(newType.id)
      }

      this.revert = () => new TypeDefinitionRemoveCommand(editor, typeContainer, newType, revertDefaultTypeId)

      commandLog(`create a new type:${JSON.stringify(newType)}, default is ${ typeContainer.getDefaultType() }`)
    })
  }
}

export default TypeCreateCommand
