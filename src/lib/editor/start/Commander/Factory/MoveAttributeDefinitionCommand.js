import ConfigurationCommand from './ConfigurationCommand'
import commandLog from './commandLog'

export default class MoveAttributeDefinitionCommand extends ConfigurationCommand {
  constructor(typeContainer, oldIndex, newIndex) {
    super()
    this._typeContainer = typeContainer
    this._oldIndex = oldIndex
    this._newIndex = newIndex
  }

  execute() {
    this._typeContainer.moveAttribute(this._oldIndex, this._newIndex)

    commandLog(
      `move the attrribute definition: from ${this._oldIndex} to ${this._newIndex}`
    )
  }

  revert() {
    return new MoveAttributeDefinitionCommand(
      this._typeContainer,
      this._newIndex,
      this._oldIndex
    )
  }
}
