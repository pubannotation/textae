import BaseCommand from './BaseCommand'
import commandLog from './commandLog'

class TypeCreateCommand extends BaseCommand {
  constructor(typeContainer, id, label) {
    super(function() {
      typeContainer.setDefinedType({
        id, label
      })

      this.revert = () => new TypeRemoveCommand(typeContainer, id, label)
      commandLog(`create a new type. id: ${id}, label: ${label}`)
    })
  }
}

class TypeRemoveCommand extends BaseCommand {
  constructor(typeContainer, id, label) {
    super(function() {
      typeContainer.remove(id)

      // Set revert
      this.revert = () => new TypeCreateCommand(typeContainer, id, label)
      commandLog(`remove a type. id: ${id}`)
    })
  }
}

export default TypeCreateCommand
