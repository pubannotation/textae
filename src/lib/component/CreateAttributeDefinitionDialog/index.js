import delegate from 'delegate'
import PromiseDialog from '../PromiseDialog'
import getInputElementValue from '../getInputElementValue'
import template from './template'

const componentClassName = `textae-editor__create-attribute-definition-dialog`

export default class CreateAttributeDefinitionDialog extends PromiseDialog {
  constructor() {
    super(
      'Please enter new attribute definition',
      template(componentClassName, { valueType: 'flag' }),
      {},
      () => {
        const state = this._state

        // Numeric Attribute property value type must be Number type.
        if (state.valueType === 'numeric') {
          return {
            ...state,
            ...{
              default: parseFloat(state.default) || 0,
              min: parseFloat(state.min) || 0,
              max: parseFloat(state.max) || 0,
              step: parseFloat(state.step) || 0
            }
          }
        }

        return state
      }
    )

    delegate(super.el, `.${componentClassName}__value-type`, 'change', () => {
      const html = template(componentClassName, this._state)
      super.el.closest('.ui-dialog-content').innerHTML = html
    })
  }

  get _state() {
    const valueType = super.el.querySelector(
      `.${componentClassName}__value-type`
    ).value
    const pred = getInputElementValue(super.el, `.${componentClassName}__pred`)
    const label = getInputElementValue(
      super.el,
      `.${componentClassName}__label`
    )
    const color = getInputElementValue(
      super.el,
      `.${componentClassName}__color`
    )
    const defaultValue = getInputElementValue(
      super.el,
      `.${componentClassName}__default-value`
    )
    const min = getInputElementValue(super.el, `.${componentClassName}__min`)
    const max = getInputElementValue(super.el, `.${componentClassName}__max`)
    const step = getInputElementValue(super.el, `.${componentClassName}__step`)

    return {
      pred,
      label,
      color,
      default: defaultValue,
      min,
      max,
      step,
      valueType
    }
  }
}
