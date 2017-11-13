import BaseCommand from './BaseCommand'
import commandLog from './commandLog'
import TypeCreateCommand from './TypeCreateCommand'

class TypeRemoveCommand extends BaseCommand {
  constructor(typeContainer, removeType) {
    super(function() {
      let id = removeType.id,
        oldType = typeContainer.getDefinedType(id)

      typeContainer.remove(id)

      if (oldType) {
        removeType = oldType
      }

      // Set revert
      this.revert = () => new TypeCreateCommand(typeContainer, removeType)
      commandLog(`remove a type. id: ${id}`)
    })
  }
}

export default TypeRemoveCommand
