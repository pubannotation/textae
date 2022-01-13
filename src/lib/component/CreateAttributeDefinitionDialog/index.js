import delegate from 'delegate'
import PromiseDialog from '../PromiseDialog'
import getInputElementValue from '../getInputElementValue'
import template from './template'

const componentClassName = `textae-editor__create-attribute-definition-dialog`

export default class CreateAttributeDefinitionDialog extends PromiseDialog {
  constructor() {
    super(
      'New attribute',
      template(componentClassName, { valueType: 'flag' }),
      {},
      () => this._state
    )

    delegate(
      super.el,
      `[name="${componentClassName}__value-type"]`,
      'change',
      () => {
        const html = template(componentClassName, this._state)
        super.el.closest('.ui-dialog-content').innerHTML = html
      }
    )
  }

  get _state() {
    const valueType = super.el.querySelector(
      `[name="${componentClassName}__value-type"]:checked`
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
    const mediaHeight = getInputElementValue(
      super.el,
      `.${componentClassName}__media-height`
    )
    const min = getInputElementValue(super.el, `.${componentClassName}__min`)
    const max = getInputElementValue(super.el, `.${componentClassName}__max`)
    const step = getInputElementValue(super.el, `.${componentClassName}__step`)

    return {
      pred,
      label,
      color,
      default: defaultValue,
      mediaHeight,
      min,
      max,
      step,
      valueType
    }
  }
}
