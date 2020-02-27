import commandLog from './commandLog'
import AddValueToAttributeDefinitionCommand from './AddValueToAttributeDefinitionCommand'
import ConfigurationCommand from './ConfigurationCommand'

export default class extends ConfigurationCommand {
  constructor(typeContainer, attrDef, index, indexThatAddDefaultTo = null) {
    super()
    this._typeContainer = typeContainer
    this._attrDef = attrDef
    this._index = index
    this._indexThatAddDefaultTo = indexThatAddDefaultTo
  }

  execute() {
    // When removing value with default property.
    if (
      this._attrDef['value type'] === 'selection' &&
      this._attrDef.values[this._index].default
    ) {
      let indexThatAddDefaultTo = null

      this._attrDef.values.forEach((v, index) => {
        if (indexThatAddDefaultTo === null && index != this._index) {
          indexThatAddDefaultTo = index
        }
      })

      this._attrDef.values[indexThatAddDefaultTo].default = true
    }

    this._deletedValue = this._attrDef.values.splice(this._index, 1)[0]

    // When undoing to add new value with default property.
    if (
      this._attrDef['value type'] === 'selection' &&
      this._indexThatAddDefaultTo !== null
    ) {
      this._attrDef.values[this._indexThatAddDefaultTo].default = true
    }

    this._typeContainer.updateAttribute(this._attrDef.pred, this._attrDef)

    commandLog(
      `remove a value from an attrribute:${this._attrDef.pred}, index:${this._index}`
    )
  }

  revert() {
    return new AddValueToAttributeDefinitionCommand(
      this._typeContainer,
      this._attrDef,
      this._deletedValue,
      this._index
    )
  }
}
