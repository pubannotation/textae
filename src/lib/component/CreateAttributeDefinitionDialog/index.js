import delegate from 'delegate'
import PromiseDialog from '../PromiseDialog'
import getInputElementValue from '../getInputElementValue'
import template from './template'

export default class CreateAttributeDefinitionDialog extends PromiseDialog {
  constructor() {
    super('Please enter new attribute definition', template({}), {}, () => {
      const valueType = super.el.querySelector(
        '.textae-editor__create-attribute-definition-dialog__value-type'
      ).value
      const pred = getInputElementValue(
        super.el,
        '.textae-editor__create-attribute-definition-dialog__pred'
      )
      const default_ = getInputElementValue(
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

      // Numeric Attribute property value type must be Number type.
      if (valueType === 'numeric') {
        return {
          'value type': valueType,
          pred,
          default: parseFloat(default_),
          min: parseFloat(min),
          max: parseFloat(max),
          step: parseFloat(step)
        }
      }

      return {
        'value type': valueType,
        pred,
        default: default_,
        min,
        max,
        step
      }
    })

    delegate(
      super.el,
      '.textae-editor__create-attribute-definition-dialog__value-type',
      'change',
      (e) => {
        const valueType = e.target.value

        const pred = getInputElementValue(
          super.el,
          '.textae-editor__create-attribute-definition-dialog__pred'
        )
        const default_ = getInputElementValue(
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

        const state = {
          pred,
          default: default_,
          min,
          max,
          step,
          valueType
        }
        state[`${valueType}Selected`] = true

        const html = template(state)
        super.el.closest('.ui-dialog-content').innerHTML = html
      }
    )
  }
}
