import delegate from 'delegate'
import PromiseDialog from '../PromiseDialog'
import getInputElementValue from '../getInputElementValue'
import template from './template'

export default class CreateAttributeDefinitionDialog extends PromiseDialog {
  constructor() {
    super(
      'Please enter new attribute definition',
      template({ valueType: 'flag' }),
      {},
      () => {
        const state = this._state

        // Numeric Attribute property value type must be Number type.
        if (state.valueType === 'numeric') {
          return Object.assign(state, {
            default: parseFloat(state.default) || 0,
            min: parseFloat(state.min) || 0,
            max: parseFloat(state.max) || 0,
            step: parseFloat(state.step) || 0
          })
        }

        return state
      }
    )
    this._componentClassName = `textae-editor__create-attribute-definition-dialog`

    delegate(
      super.el,
      `.${this._componentClassName}__value-type`,
      'change',
      () => {
        const html = template(this._state)
        super.el.closest('.ui-dialog-content').innerHTML = html
      }
    )
  }

  get _state() {
    const valueType = super.el.querySelector(
      `.${this._componentClassName}__value-type`
    ).value
    const pred = getInputElementValue(
      super.el,
      `.${this._componentClassName}__pred`
    )
    const defaultValue = getInputElementValue(
      super.el,
      `.${this._componentClassName}__default-value`
    )
    const min = getInputElementValue(
      super.el,
      `.${this._componentClassName}__min`
    )
    const max = getInputElementValue(
      super.el,
      `.${this._componentClassName}__max`
    )
    const step = getInputElementValue(
      super.el,
      `.${this._componentClassName}__step`
    )

    return {
      pred,
      default: defaultValue,
      min,
      max,
      step,
      valueType
    }
  }
}
