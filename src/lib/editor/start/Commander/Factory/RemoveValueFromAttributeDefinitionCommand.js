import commandLog from './commandLog'
import AddValueToAttributeDefinitionCommand from './AddValueToAttributeDefinitionCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class RemoveValueFromAttributeDefinitionCommand extends ConfigurationCommand {
  constructor(typeContainer, attrDef, index, indexThatAddDefaultTo = null) {
    super()
    this._typeContainer = typeContainer
    this._attrDef = attrDef
    this._index = index
    this._indexThatAddDefaultTo = indexThatAddDefaultTo
  }

  execute() {
    const clonedJSON = this._attrDef.JSON
    // When removing value with default property.
    if (
      this._attrDef.valueType === 'selection' &&
      clonedJSON.values[this._index].default &&
      this._indexThatAddDefaultTo === null
    ) {
      let indexThatAddDefaultTo = null

      clonedJSON.values.forEach((_, index) => {
        if (indexThatAddDefaultTo === null && index != this._index) {
          indexThatAddDefaultTo = index
        }
      })

      clonedJSON.values[indexThatAddDefaultTo].default = true
    }

    this._deletedValue = clonedJSON.values.splice(this._index, 1)[0]

    // When undoing to add new value with default property.
    if (
      this._attrDef.valueType === 'selection' &&
      this._indexThatAddDefaultTo !== null
    ) {
      clonedJSON.values[this._indexThatAddDefaultTo].default = true
    }

    this._updatedAttrDef = this._typeContainer.updateValues(
      this._attrDef.pred,
      clonedJSON.values
    )

    commandLog(
      `remove a value from an attrribute:${this._attrDef.pred}, index:${
        this._index
      }, updated values: \n ${clonedJSON.values
        .map((v) => JSON.stringify(v))
        .join('\n ')}`
    )
  }

  revert() {
    return new AddValueToAttributeDefinitionCommand(
      this._typeContainer,
      this._updatedAttrDef,
      this._deletedValue,
      this._index
    )
  }
}
