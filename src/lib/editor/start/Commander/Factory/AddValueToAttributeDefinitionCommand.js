import commandLog from './commandLog'
import RemoveValueFromAttributeDefinitionCommand from './RemoveValueFromAttributeDefinitionCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class AddValueToAttributeDefinitionCommand extends ConfigurationCommand {
  constructor(definitionContainer, attrDef, value, index = null) {
    super()
    this._definitionContainer = definitionContainer
    this._pred = attrDef.pred
    this._index = index
    this._value = value

    const values = [...attrDef.values]
    if (attrDef.valueType === 'selection') {
      // When adding default, remove default property from existing default value.
      if (value.default) {
        if (!this._indexThatRemoveDefaultFrom) {
          this._indexThatRemoveDefaultFrom = values.findIndex((v) => v.default)
        }

        const newValue = { ...values[this._indexThatRemoveDefaultFrom] }
        delete newValue.default
        values[this._indexThatRemoveDefaultFrom] = newValue
      }
    }

    // When undoing, insert to the position before remove.
    // The array of values is a copy. If you add values to the array of values when the command executes,
    // the value object will increase each time the command is executed.
    values.splice(index || values.length, 0, value)

    this._modifiedValues = values
  }

  execute() {
    this._updatedAttrDef = this._definitionContainer.updateValues(
      this._pred,
      this._modifiedValues
    )

    commandLog(
      `add a new value to attrribute:${this._pred}, value: ${JSON.stringify(
        this._value
      )}, index: ${
        this._index
      }, updated values: \n ${this._modifiedValues
        .map((v) => JSON.stringify(v))
        .join('\n ')}`
    )
  }

  revert() {
    return new RemoveValueFromAttributeDefinitionCommand(
      this._definitionContainer,
      this._updatedAttrDef,
      this._updatedAttrDef.values.length - 1,
      this._indexThatRemoveDefaultFrom
    )
  }
}
