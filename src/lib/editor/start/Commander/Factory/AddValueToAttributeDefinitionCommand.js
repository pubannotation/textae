import commandLog from './commandLog'
import RemoveValueFromAttributeDefinitionCommand from './RemoveValueFromAttributeDefinitionCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class extends ConfigurationCommand {
  constructor(typeContainer, attrDef, value, index = null) {
    super()
    this._typeContainer = typeContainer
    this._attrDef = attrDef
    this._value = value
    this._index = index
  }

  execute() {
    // When undoing, insert to the position before remove.
    this._attrDef.values.splice(
      this._index || this._attrDef.values.length,
      0,
      this._value
    )
    this._updatedAttrDef = this._typeContainer.updateAttribute(
      this._attrDef.pred,
      this._attrDef
    ).JSON

    commandLog(
      `add a new value to attrribute:${
        this._attrDef.pred
      }, value: ${JSON.stringify(this._value)}, index: ${this._index}`
    )
  }

  revert() {
    return new RemoveValueFromAttributeDefinitionCommand(
      this._typeContainer,
      this._updatedAttrDef,
      this._updatedAttrDef.values.length - 1
    )
  }
}
