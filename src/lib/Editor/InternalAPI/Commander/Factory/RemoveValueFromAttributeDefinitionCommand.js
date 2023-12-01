import commandLog from './commandLog'
import AddValueToAttributeDefinitionCommand from './AddValueToAttributeDefinitionCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class RemoveValueFromAttributeDefinitionCommand extends ConfigurationCommand {
  constructor(
    definitionContainer,
    attrDef,
    index,
    indexThatAddDefaultTo = null
  ) {
    super()
    this._definitionContainer = definitionContainer
    this._attrDef = attrDef
    this._index = index
    this._indexThatAddDefaultTo = indexThatAddDefaultTo
  }

  execute() {
    const values = [...this._attrDef.values]
    // When removing value with default property.
    if (
      this._attrDef.valueType === 'selection' &&
      values[this._index].default &&
      this._indexThatAddDefaultTo === null
    ) {
      let indexThatAddDefaultTo = null

      values.forEach((_, index) => {
        if (indexThatAddDefaultTo === null && index != this._index) {
          indexThatAddDefaultTo = index
        }
      })

      values[indexThatAddDefaultTo] = {
        ...values[indexThatAddDefaultTo],
        ...{ default: true }
      }
    }

    this._deletedValue = values.splice(this._index, 1)[0]

    // When undoing to add new value with default property.
    if (
      this._attrDef.valueType === 'selection' &&
      this._indexThatAddDefaultTo !== null
    ) {
      values[this._indexThatAddDefaultTo] = {
        ...values[this._indexThatAddDefaultTo],
        ...{ default: true }
      }
    }

    this._updatedAttrDef = this._definitionContainer.updateValues(
      this._attrDef.pred,
      values
    )

    commandLog(
      this,
      `remove a value from an attrribute:${this._attrDef.pred}, index:${
        this._index
      }, updated values: \n ${values.map((v) => JSON.stringify(v)).join('\n ')}`
    )
  }

  revert() {
    return new AddValueToAttributeDefinitionCommand(
      this._definitionContainer,
      this._updatedAttrDef,
      this._deletedValue,
      this._index
    )
  }
}
