import commandLog from './commandLog'
import AddValueToAttributeDefinitionCommand from './AddValueToAttributeDefinitionCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class extends ConfigurationCommand {
  constructor(typeContainer, attrDef, index) {
    super()
    this._typeContainer = typeContainer
    this._attrDef = attrDef
    this._index = index
  }

  execute() {
    const attrDef = this._attrDef.JSON
    this._deletedValue = attrDef.values.splice(this._index, 1)[0]
    this._typeContainer.updateAttribute(attrDef.pred, attrDef)

    commandLog(
      `remove a value from an attrribute:${attrDef.pred}, index:${this._index}`
    )
  }

  revert() {
    return new AddValueToAttributeDefinitionCommand(
      this._typeContainer,
      this._attrDef.JSON,
      this._deletedValue,
      this._index
    )
  }
}
