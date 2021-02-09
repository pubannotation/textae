import commandLog from '../commandLog'
import ConfigurationCommand from '../ConfigurationCommand'

export default class ChangeValueOfAttributeDefinitionCommand extends ConfigurationCommand {
  constructor(
    typeContainer,
    attrDef,
    targetIndex,
    newValue,
    indexThatRemoveDefaultFrom
  ) {
    super()
    this._typeContainer = typeContainer
    this._attrDef = attrDef
    this._targetIndex = targetIndex
    this._newValue = newValue
    this._indexThatRemoveDefaultFrom = indexThatRemoveDefaultFrom
  }

  execute() {
    // Change default value of selection attribute.
    if (this._attrDef['value type'] === 'selection') {
      // When adding default
      if (
        !this._attrDef.values[this._targetIndex].default &&
        this._newValue.default
      ) {
        if (!this._indexThatRemoveDefaultFrom) {
          this._indexThatRemoveDefaultFrom = this._attrDef.values.findIndex(
            (v) => v.default
          )
        }

        delete this._attrDef.values[this._indexThatRemoveDefaultFrom].default
      }

      // Remove the property itself if it is false.
      if (this._newValue.default === false) {
        delete this._newValue.default
      }

      // When removeing default.
      if (
        this._attrDef.values[this._targetIndex].default &&
        !this._newValue.default
      ) {
        if (this._attrDef.values.length === 1) {
          this._newValue.default = true
        } else if (this._indexThatRemoveDefaultFrom) {
          this._attrDef.values[this._indexThatRemoveDefaultFrom].default = true
        } else {
          let indexThatAddDefaultTo = null

          this._attrDef.values.forEach((v, index) => {
            if (indexThatAddDefaultTo === null && index != this._targetIndex) {
              indexThatAddDefaultTo = index
            }
          })

          this._attrDef.values[indexThatAddDefaultTo].default = true
          this._indexThatRemoveDefaultFrom = indexThatAddDefaultTo
        }
      }
    }

    this._valueBeforeChange = this._attrDef.values.splice(
      this._targetIndex,
      1,
      this._newValue
    )[0]

    this._typeContainer.update(this._attrDef.pred, this._attrDef)

    commandLog(
      `change value of attrribute:${
        this._attrDef.pred
      }, oldValue: ${JSON.stringify(
        this._valueBeforeChange
      )}, newValue: ${JSON.stringify(this._newValue)}`
    )
  }

  revert() {
    return new ChangeValueOfAttributeDefinitionCommand(
      this._typeContainer,
      this._attrDef,
      this._targetIndex,
      this._valueBeforeChange,
      this._indexThatRemoveDefaultFrom
    )
  }
}
