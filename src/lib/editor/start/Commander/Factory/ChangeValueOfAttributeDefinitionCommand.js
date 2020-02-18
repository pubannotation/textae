import commandLog from './commandLog'
import ConfigurationCommand from './ConfigurationCommand'

export default class ChangeValueOfAttributeDefinitionCommand extends ConfigurationCommand {
  constructor(typeContainer, attrDef, index, value) {
    super()
    this._typeContainer = typeContainer
    this._attrDef = attrDef
    this._index = index
    this._value = value
  }

  execute() {
    this._valueBeforeChange = this._attrDef.values.splice(
      this._index,
      1,
      this._value
    )[0]

    this._typeContainer.updateAttribute(this._attrDef.pred, this._attrDef.JSON)

    commandLog(
      `change value of attrribute:${
        this._attrDef.pred
      }, oldValue: ${JSON.stringify(
        this._valueBeforeChange
      )}, newValue: ${JSON.stringify(this._value)}`
    )
  }

  revert() {
    return new ChangeValueOfAttributeDefinitionCommand(
      this._typeContainer,
      this._attrDef,
      this._index,
      this._valueBeforeChange
    )
  }
}
