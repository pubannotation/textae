import commandLog from '../commandLog'
import ConfigurationCommand from '../ConfigurationCommand'

export default class ChangeValueOfAttributeDefinitionCommand extends ConfigurationCommand {
  constructor(
    typeContainer,
    attrDef,
    index,
    value,
    indexThatRemoveDefaultFrom
  ) {
    super()
    this._typeContainer = typeContainer
    this._attrDef = attrDef
    this._index = index
    this._value = value
    this._indexThatRemoveDefaultFrom = indexThatRemoveDefaultFrom
  }

  execute() {
    // Change default value of selection attribute.
    if (this._attrDef['value type'] === 'selection') {
      // When adding default
      if (!this._attrDef.values[this._index].default && this._value.default) {
        if (!this._indexThatRemoveDefaultFrom) {
          this._indexThatRemoveDefaultFrom = this._attrDef.values.findIndex(
            (v) => v.default
          )
        }

        delete this._attrDef.values[this._indexThatRemoveDefaultFrom].default
      }

      // When removeing default.
      if (this._attrDef.values[this._index].default && !this._value.default) {
        if (this._attrDef.values.length === 1) {
          this._value.default = true
        } else {
          let indexThatAddDefaultTo = null

          this._attrDef.values.forEach((v, index) => {
            if (indexThatAddDefaultTo === null && index != this._index) {
              indexThatAddDefaultTo = index
            }
          })

          // Remove the property itself as it can be false.
          delete this._value.default

          this._attrDef.values[indexThatAddDefaultTo].default = true
          this._indexThatRemoveDefaultFrom = indexThatAddDefaultTo
        }
      }
    }

    this._valueBeforeChange = this._attrDef.values.splice(
      this._index,
      1,
      this._value
    )[0]

    this._typeContainer.update(this._attrDef.pred, this._attrDef)

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
      this._valueBeforeChange,
      this._indexThatRemoveDefaultFrom
    )
  }
}
