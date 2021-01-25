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
            default: parseFloat(state.default),
            min: parseFloat(state.min),
            max: parseFloat(state.max),
            step: parseFloat(state.step)
          })
        }

        return state
      }
    )

    delegate(
      super.el,
      '.textae-editor__create-attribute-definition-dialog__value-type',
      'change',
      () => {
        const html = template(this._state)
        super.el.closest('.ui-dialog-content').innerHTML = html
      }
    )
  }

  get _state() {
    const valueType = super.el.querySelector(
      '.textae-editor__create-attribute-definition-dialog__value-type'
    ).value
    const pred = getInputElementValue(
      super.el,
      '.textae-editor__create-attribute-definition-dialog__pred'
    )
    const defaultValue = getInputElementValue(
      super.el,
      '.textae-editor__create-attribute-definition-dialog__default'
    )
    const min = getInputElementValue(
      super.el,
      '.textae-editor__create-attribute-definition-dialog__min'
    )
    const max = getInputElementValue(
      super.el,
      '.textae-editor__create-attribute-definition-dialog__max'
    )
    const step = getInputElementValue(
      super.el,
      '.textae-editor__create-attribute-definition-dialog__step'
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
