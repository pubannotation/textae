import ConfigurationCommand from './ConfigurationCommand'
import commandLog from './commandLog'

export default class MoveAttributeDefinitionCommand extends ConfigurationCommand {
  constructor(definitionContainer, oldIndex, newIndex) {
    super()
    this._definitionContainer = definitionContainer
    this._oldIndex = oldIndex
    this._newIndex = newIndex
  }

  execute() {
    this._definitionContainer.move(this._oldIndex, this._newIndex)

    commandLog(
      this,
      `move the attrribute definition: from ${this._oldIndex} to ${this._newIndex}`
    )
  }

  revert() {
    return new MoveAttributeDefinitionCommand(
      this._definitionContainer,
      this._newIndex,
      this._oldIndex
    )
  }
}
