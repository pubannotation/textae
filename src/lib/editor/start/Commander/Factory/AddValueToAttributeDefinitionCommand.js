import commandLog from './commandLog'
import RemoveValueFromAttributeDefinitionCommand from './RemoveValueFromAttributeDefinitionCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class AddValueToAttributeDefinitionCommand extends ConfigurationCommand {
  constructor(typeContainer, attrDef, value, index = null) {
    super()
    this._typeContainer = typeContainer

    if (attrDef['value type'] === 'selection') {
      // When adding default, remove default property from existing default value.
      if (value.default) {
        if (!this._indexThatRemoveDefaultFrom) {
          this._indexThatRemoveDefaultFrom = attrDef.values.findIndex(
            (v) => v.default
          )
        }

        delete attrDef.values[this._indexThatRemoveDefaultFrom].default
      }
    }

    // When undoing, insert to the position before remove.
    // The array of values is a copy. If you add values to the array of values when the command executes,
    // the value object will increase each time the command is executed.
    attrDef.values.splice(index || attrDef.values.length, 0, value)

    this._attrDef = attrDef
    this._value = value
    this._index = index
  }

  execute() {
    this._updatedAttrDef = this._typeContainer.update(
      this._attrDef.pred,
      this._attrDef
    )

    commandLog(
      `add a new value to attrribute:${
        this._attrDef.pred
      }, value: ${JSON.stringify(this._value)}, index: ${
        this._index
      }, updated values: \n ${this._attrDef.values
        .map((v) => JSON.stringify(v))
        .join('\n ')}`
    )
  }

  revert() {
    return new RemoveValueFromAttributeDefinitionCommand(
      this._typeContainer,
      this._updatedAttrDef.JSON,
      this._updatedAttrDef.values.length - 1,
      this._indexThatRemoveDefaultFrom
    )
  }
}
