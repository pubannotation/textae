import BaseCommand from './BaseCommand'
import commandLog from './commandLog'

class TypeChangeLabelCommand extends BaseCommand {
  constructor(typeContainer, id, label) {
    super(function() {
      const oldType = typeContainer.getDefinedType(id),
        oldLabel = oldType.label

      typeContainer.setDefinedType(
        Object.assign(oldType, {
          label
        })
      )

      // Set revert
      this.revert = () => new TypeChangeLabelCommand(typeContainer, id, oldLabel)

      commandLog(`change label of a type. id: ${id}, old label: ${oldLabel}, new label: ${label}`)
    })
  }
}

export default TypeChangeLabelCommand
