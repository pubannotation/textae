import BaseCommand from './BaseCommand'
import commandLog from './commandLog'
import TypeCreateCommand from './TypeCreateCommand'

class TypeRemoveCommand extends BaseCommand {
  constructor(editor, typeContainer, removeType, revertDefaultTypeId) {
    super(function() {
      let id = removeType.id,
        oldType = typeContainer.getDefinedType(id)

      typeContainer.remove(id)

      if (revertDefaultTypeId) {
        typeContainer.setDefaultType(revertDefaultTypeId)
      }

      if (oldType) {
        removeType = oldType
      }

      // Set revert
      this.revert = () => new TypeCreateCommand(editor, typeContainer, removeType)

      editor.eventEmitter.emit('textae.pallet.update')
      commandLog('remove a type:' + JSON.stringify(removeType)
        + ', default is `' + typeContainer.getDefaultType() + '`')
    })
  }
}

export default TypeRemoveCommand
