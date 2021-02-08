import commandLog from './commandLog'
import RemoveValueFromAttributeDefinitionCommand from './RemoveValueFromAttributeDefinitionCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class AddValueToAttributeDefinitionCommand extends ConfigurationCommand {
  constructor(typeContainer, attrDef, value, index = null) {
    super()
    this._typeContainer = typeContainer
    this._pred = attrDef.pred
    this._index = index
    this._value = value

    const clonedJSON = attrDef.JSON
    if (clonedJSON['value type'] === 'selection') {
      // When adding default, remove default property from existing default value.
      if (value.default) {
        if (!this._indexThatRemoveDefaultFrom) {
          this._indexThatRemoveDefaultFrom = clonedJSON.values.findIndex(
            (v) => v.default
          )
        }

        delete clonedJSON.values[this._indexThatRemoveDefaultFrom].default
      }
    }

    // When undoing, insert to the position before remove.
    // The array of values is a copy. If you add values to the array of values when the command executes,
    // the value object will increase each time the command is executed.
    clonedJSON.values.splice(index || clonedJSON.values.length, 0, value)

    this._modifiedAttrHash = clonedJSON
  }

  execute() {
    this._updatedAttrDef = this._typeContainer.updateValues(
      this._pred,
      this._modifiedAttrHash.values
    )

    commandLog(
      `add a new value to attrribute:${this._pred}, value: ${JSON.stringify(
        this._value
      )}, index: ${
        this._index
      }, updated values: \n ${this._modifiedAttrHash.values
        .map((v) => JSON.stringify(v))
        .join('\n ')}`
    )
  }

  revert() {
    return new RemoveValueFromAttributeDefinitionCommand(
      this._typeContainer,
      this._updatedAttrDef,
      this._updatedAttrDef.values.length - 1,
      this._indexThatRemoveDefaultFrom
    )
  }
}
