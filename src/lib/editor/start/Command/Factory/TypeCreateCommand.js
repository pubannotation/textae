import BaseCommand from './BaseCommand'
import commandLog from './commandLog'
import TypeRemoveCommand from './TypeRemoveCommand'

class TypeCreateCommand extends BaseCommand {
  constructor(typeContainer, newType) {
    super(function() {
      typeContainer.setDefinedType(newType)

      this.revert = () => new TypeRemoveCommand(typeContainer, newType)

      commandLog(`create a new type. id: ${newType.id}, label: ${newType.label}`)
    })
  }
}

export default TypeCreateCommand
