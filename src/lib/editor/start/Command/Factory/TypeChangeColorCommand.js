import BaseCommand from './BaseCommand'
import commandLog from './commandLog'

class TypeChangeColorCommand extends BaseCommand {
  constructor(typeContainer, id, newColor) {
    super(function() {
      const oldType = typeContainer.getDefinedType(id),
        oldColor = oldType.color || typeContainer.getColor()

      if (newColor === '') {
        typeContainer.remove(id)
        newColor = typeContainer.getColor()
      } else {
        typeContainer.setDefinedType(
          Object.assign(oldType, {
            id: id,
            color: newColor
          })
        )
      }

      // Set revert
      this.revert = () => new TypeChangeColorCommand(typeContainer, id, oldColor)

      commandLog(`change color of a type. id: ${id}, old color: ${oldColor}, new color: ${newColor}`)
    })
  }
}

export default TypeChangeColorCommand
